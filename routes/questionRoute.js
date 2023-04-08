/** 
 * Internal Documentation
 * Routes for Question APIs
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */
const router = require('express').Router();
const {createQuestion,viewMyQuestions,updateQuestion,deleteQuestion} = require('../controllers/questionsController');

module.exports = (passport) => {
  router.post('/create',passport.authenticate('jwt',{session:false}),createQuestion);
  router.get('/my-questions',passport.authenticate('jwt',{session:false}),viewMyQuestions);
  router.put('/:questionId',passport.authenticate('jwt',{session:false}),updateQuestion);
  router.delete('/:questionId',passport.authenticate('jwt',{session:false}),deleteQuestion);
  return router;
}