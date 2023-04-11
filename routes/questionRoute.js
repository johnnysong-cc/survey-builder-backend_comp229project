/** 
 * Internal Documentation
 * question APIs routers
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */

const router = require('express').Router();
const {createQuestion,viewMyQuestions,updateQuestion,deleteQuestion} = require('../controllers/questionsController');

//#region Multer for form-data compatibility
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
//#endregion

module.exports = (passport) => {
  router.get('/my-questions',passport.authenticate('jwt',{session:false}),viewMyQuestions);
  router.post('/create',upload.none(),passport.authenticate('jwt',{session:false}),createQuestion);
  router.put('/:questionId',upload.none(),passport.authenticate('jwt',{session:false}),updateQuestion);
  router.delete('/:questionId',upload.none(),passport.authenticate('jwt',{session:false}),deleteQuestion);
  return router;
}