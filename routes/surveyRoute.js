/** 
 * Internal Documentation
 * survey APIs routes
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */
const router = require('express').Router();
const jwt=require('jsonwebtoken');
const {User}=require('../models/userModel');
const {createSurvey,getAllVisibleSurvey,getOwnSurveys,updateSurvey,deleteSurvey,toggleVisibility,setPeriod,pushResponse,getOwnedResponses,getStatistics}=require('../controllers/surveysController');

//#region Multer for form-data compatibility
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
//#endregion

//#region custom JWT strategy
const optionalAuthenticate = async (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if(!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded._id); // NULL: JWT token is not stored as _id but as id⚠️
    // console.log(decoded.id); // for debugging
    const user = await User.findById(decoded.id);
    // console.log("user: ",user); // for debugging
    if(!user) return next();
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    next();
  }
}
//#endregion

module.exports = (passport) => {
  router.get('/all',getAllVisibleSurvey);
  router.get('/allowned',passport.authenticate('jwt',{session: false}),getOwnSurveys);
  router.get('/allownedresponses',passport.authenticate('jwt',{session: false}),getOwnedResponses);
  router.get('/statistics/',passport.authenticate('jwt',{session: false}),getStatistics);
  router.post('/create',passport.authenticate('jwt',{session:false}),createSurvey);
  router.post('/:surveyId/push',optionalAuthenticate,pushResponse);
  router.put('/:surveyId',passport.authenticate('jwt',{session:false}),updateSurvey);
  router.put('/:surveyId/toggle',passport.authenticate('jwt',{session: false}),toggleVisibility);
  router.put('/:surveyId/setperiod',passport.authenticate('jwt',{session: false}),setPeriod);
  router.delete('/:surveyId',passport.authenticate('jwt',{session:false}),deleteSurvey);
  return router;
}