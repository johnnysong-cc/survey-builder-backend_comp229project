/** 
 * Internal Documentation
 * APIs for Question
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */
const {Question} = require('../models/questionModel');

module.exports = {
  createQuestion: async (req,res) => {
    const {questionText,questionType,choices,isCorrect} = req.body;
    try{
      const newQuestion = new Question({
        questionText,
        questionType,
        createdBy: req.user._id,
        choices,
        isCorrect
      });
      await newQuestion.save();
      res.status(201).json({message: 'Question created successfully.'});
    }catch(err){
      if(err.name === 'ValidationError'){
        let message = '';
        for(const field in err.errors)
          message += err.errors[field].message;
        return res.status(400).json({
          message:"Validation Error: "+message, 
          errors: err.message
        });
      }else
        return res.status(500).json({message: err.message});
    }
  },
  viewMyQuestions: async (req,res) => {
    try{
      const questions = await Question.find({createdBy: req.user._id});
      res.status(200).json({message:"User created questions retrieved", questions});
    }catch(err){
      return res.status(500).json({message: err.message});
    }
  },
  updateQuestion: async (req,res) => {
    const {questionText,questionType,choices,isCorrect} = req.body;
    try{
      //#region grab the question from the database and check permissions
      const currentQuestion = await Question.findById({_id: req.params.questionId});
      if(!currentQuestion)
        return res.status(404).json({message: 'Question not found'});
      if(currentQuestion.createdBy.toString() !== req.user._id)
        return res.status(401).json({message: 'You are not authorized to edit this question'});
      //#endregion

      //#region update the question
      if(questionText) currentQuestion.questionText = questionText;
      if(questionType) currentQuestion.questionType = questionType;
      if(choices) currentQuestion.choices = choices;
      if(isCorrect) currentQuestion.isCorrect = isCorrect;
      //#endregion

      await Question.updateOne({_id: req.params.questionId, createdBy: req.user.id},currentQuestion);
      res.status(200).json({message: 'Question updated successfully'});
    }catch(err){
      if(err.name === 'ValidationError'){
        let message = '';
        for(const field in err.errors)
          message += err.errors[field].message;
        return res.status(400).json({
          message:"Validation Error: "+message, 
          errors: err.message
        });
      }else
        return res.status(500).json({message: err.message});
    }
  },
  deleteQuestion: async (req,res) => {
    try{
      const currentQuestion = await Question.findById(req.params.questionId);
      if(!currentQuestion)
        return res.status(404).json({message: 'Question not found'});
      if(currentQuestion.createdBy.toString() !== req.user._id)
        return res.status(403).json({message: 'You are not authorized to delete this question'});

      await Question.deleteOne({_id: req.params.questionId, createdBy: req.user._id});
      res.status(200).json({message: 'Question deleted successfully'});
    }catch(err){
      return res.status(500).json({message: err.message});
    }
  }
};