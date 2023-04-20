/** 
 * Internal Documentation
 * Survey APIs
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */

const {Survey} = require('../models/surveyModel');
const {Response} = require('../models/responseModel');
const {Question} = require('../models/questionModel');
module.exports = {
  getAllVisibleSurvey: async (req,res) => {
    try {
      const surveys = await Survey.find({isVisible: true,isExpired:false}).populate('questions');
      if (!surveys)
        return res.status(404).json({message: 'No visible survey found.'});
      res.status(200).json(surveys);
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  },
  getOwnSurveys: async (req,res) => {
    console.log('req.user:',req.user);
    try {
      const surveys = await Survey.find({creator: req.user._id}).populate('questions');
      if (!surveys)
        return res.status(404).json({message: 'No surveys created by the current owner found.'});
      res.status(200).json(surveys);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },
  createSurvey: async (req,res) => {
    const {title,description,startDate,endDate,questionIds} = req.body;
    try{
      if(!Array.isArray(questionIds) || questionIds.length < 5 || questionIds.length > 20){
        return res.status(400).json({message: 'The number of questions must be within 5 to 20.'});
      }
      const questions = await Question.find({_id: {$in: questionIds}});
      console.log(questions);
      const newSurvey = new Survey({
        title,
        description,
        creator: req.user._id,
        startDate,
        endDate,
        questions: questions.map(q => q._id)
      });
      await newSurvey.save();
      res.status(201).json({message: 'Survey created successfully.'});
    }catch(err){
      if(err.name === 'ValidationError'){
        return res.status(400).json({
          message: "Validation Error: ", 
          errors: err.message
        });
      }else
        return res.status(500).json({message: err.message});
    }
  },
  updateSurvey: async (req,res) => {
    const {title,description,startDate,endDate,isVisible,questionIds} = req.body;
    try{
      const currentSurvey = await Survey.findById({_id: req.params.surveyId});
      if(!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if(currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to edit this survey.'});
      if(title) currentSurvey.title = title;
      if(description) currentSurvey.description = description;
      if(startDate) currentSurvey.startDate = startDate;
      if(endDate) currentSurvey.endDate = endDate;
      if(isVisible) currentSurvey.isVisible = isVisible;
      if(questionIds){
        if(!Array.isArray(questionIds) || questionIds.length < 5 || questionIds.length > 20){
          return res.status(400).json({message: 'The number of questions must be within 5 to 20.'});
        }
        const questions = await Question.find({_id: {$in: questionIds}});
        currentSurvey.questions = questions.map(q => q._id);
      }
      await currentSurvey.save();
      res.status(200).json({message: 'Survey updated successfully.'});
    }catch(err){
      if(err.name === 'ValidationError'){
        let message = '';
        for (const field in err.errors)
          message += err.errors[field].message;
        return res.status(400).json({
          message: "Validation Error: " + message, 
          errors: err.message
        });
      }else
        return res.status(500).json({message: err.message});
    }
  },
  deleteSurvey: async (req,res) => {
    const {surveyId} = req.params;
    try{
      const currentSurvey = await Survey.findById({_id: surveyId, creator: req.user._id});
      if(!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if(currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to delete this survey.'});
      await Survey.deleteOne({_id: surveyId, creator: req.user._id});
      res.status(200).json({message: 'Survey deleted successfully.'});
    }catch(err){
      return res.status(500).json({message: err.message});
    }
  },
  toggleVisibility: async (req,res) => {
    const {surveyId} = req.params;
    try{
      const currentSurvey = await Survey.findById({_id: surveyId});
      if(!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if(currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to edit this survey.'});
      currentSurvey.isVisible = !currentSurvey.isVisible;
      await currentSurvey.save();
      res.status(200).json({message: 'Survey visibility toggled successfully.'});
    }catch(err){
      return res.status(500).json({message: err.message});
    }
  },
  setPeriod: async (req,res) => {
    const {surveyId} = req.params;
    const {startDate,endDate} = req.body;
    try{
      const currentSurvey = await Survey.findById({_id: surveyId});
      if(!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if(currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to edit this survey.'});
      if(!startDate || !endDate)
        return res.status(400).json({message: 'Both start date and end date are required.'});
      currentSurvey.startDate = startDate;
      currentSurvey.endDate = endDate;
      await currentSurvey.save();
      res.status(200).json({message: 'Survey period set successfully.'});
    }catch(err){
      if(err.name === 'ValidationError'){
        return res.status(400).json({
          message: "Validation Error: " + err.errors.map(e => e.message).join(' '), 
          errors: err.message
        });
      }else
        return res.status(500).json({message: err.message});
    }
  },
  getOwnedResponses: async (req,res) => {
    console.log(req.user.id);
    console.log(req.user._id);
    if(!req.user)
      return res.status(401).json({message: 'You are not authorized to view this page.'});
    try{
      const responses = await Response.find({responder: req.user.id}).populate('survey');
      return res.status(200).json({responses});
    }catch(err){
      return res.status(500).json({message: err.message});
    }
  },
  pushResponse: async (req,res) => {
    const {surveyId} = req.params;
    const {useranswers} = req.body;
    //#region check existence and consistency of nubmers of questions and useranswers
    const currentSurvey = await Survey.findById({_id: surveyId});
    if(!currentSurvey)
      return res.status(404).json({message: 'Void survey.'});
    if(!Array.isArray(useranswers) || useranswers.length !== currentSurvey.questions.length ){
      return res.status(400).json({message: 'The number of useranswers must be equal to the number of questions.'});
    }
    //#endregion
    //#region Create a new response object
    //common properties
    let newResponse = new Response({
      userAnswers: useranswers,
      survey: currentSurvey._id
    });
    if(req.user){
      newResponse.responder = req.user._id;
      newResponse.isFromAnonymous = false;
    }else{
      newResponse.isFromAnonymous = true;
    }
    currentSurvey.responses.push(newResponse._id);
    console.log("correct answers",currentSurvey.correctAnswers);
    console.log("correct answers amount",currentSurvey.correctAnswers.length);
    let score = 0;
    for (let i = 0;i < currentSurvey.correctAnswers.length; i++){
      console.log("Correct answer: " + currentSurvey.correctAnswers[i], "User answer: " + useranswers[i]);
      if(currentSurvey.correctAnswers[i] === useranswers[i])
        score++;
    }
    console.log(score);
    newResponse.score = Math.round(score*100/currentSurvey.questions.length,4);
      try{
        await Promise.all([newResponse.save(), currentSurvey.save()]);
        res.status(200).json({message: 'Response submitted and survey updated successfully.'});
      }catch(err){
        if(err.name === 'ValidationError'){
          let message = '';
          for(const f in err.errors)
            message += err.errors[f].message;
          return res.status(400).json({
            message: "Validation Error: "+message, 
            errors: err.message
          });
        }else
          return res.status(500).json({message: err.message});
      }
  },
  getStatistics: async (req,res) => {
    try{
      const mysurveys = await Survey.find({creator: req.user._id}).populate('responses').populate('questions');
      const numberOfSurveys = mysurveys.length;
      const grossNumberOfResponses = mysurveys.reduce((acc,cur) => acc + cur.responses.length,0);
      const grossNumberOfQuestions = mysurveys.reduce((acc,cur) => acc + cur.questions.length,0);
      const numberOfResponses = mysurveys.map(survey => {
        return {
          title: survey.title,
          numberOfQuestions: survey.questions.length,
          numberOfResponses: survey.responses.length
        }
      });
      const averageScores = mysurveys.map(survey => {
        const totalScore = survey.responses.reduce((acc,cur) => acc + cur.score,0);
        return {
          title: survey.title,
          averageScore: totalScore/survey.responses.length
        }
      });
      return res.status(200).json({
        grossNumberOfYourSurveys: numberOfSurveys,
        grossNumberOfResponses: grossNumberOfResponses,
        grossNumberOfQuestions: grossNumberOfQuestions,
        numberOfResponsesOfYourSurveys: numberOfResponses,
        averageScoresOfYourSurveys: averageScores
      });
    }catch(err){
      return res.status(500).json({message: err.message});
    }
  }
};