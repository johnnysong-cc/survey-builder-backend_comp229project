/** 
 * Internal Documentation
 * Routes for Question APIs
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */
const router = require('express').Router();
const {createQuestion,viewMyQuestions,updateQuestion,deleteQuestion} = require('../controllers/questionsController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

module.exports = (passport) => {
  router.get('/my-questions',passport.authenticate('jwt',{session: false}),viewMyQuestions);
  router.post('/createquestion',upload.none(),passport.authenticate('jwt',{session: false}),createQuestion);
  router.put('/:questionId',upload.none(),passport.authenticate('jwt',{session: false}),updateQuestion);
  router.delete('/:questionId',upload.none(),passport.authenticate('jwt',{session: false}),deleteQuestion);
  return router;
};