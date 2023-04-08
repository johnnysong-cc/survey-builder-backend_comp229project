const router = require('express').Router();
const {register,login,updateProfile} = require('../controllers/userMgmtController');

module.exports = (passport) => {
  router.post('/register',register);
  router.post('/login',login);
  router.put('/update',passport.authenticate('jwt',{session: false}),updateProfile);
  return router;
};
