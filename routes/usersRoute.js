/** 
 * Internal Documentation
 * Routes for User Management APIs
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */
const router = require('express').Router();
const {register,login,updateProfile} = require('../controllers/userMgmtController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

module.exports = (passport) => {
  router.post('/register',upload.none(),register);
  router.post('/login',upload.none(),login);
  router.put('/update',upload.none(),passport.authenticate('jwt',{session: false}),updateProfile);
  return router;
};
