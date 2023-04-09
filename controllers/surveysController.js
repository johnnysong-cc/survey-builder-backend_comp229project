/** 
 * Internal Documentation
 * Survey APIs
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */
const {Survey,Response} = require('../models/surveyModel');
const {Question} = require('../models/questionModel');
const {User} = require('../models/userModel');
module.exports = {
  getAllVisibleSurvey: async (req,res) => {
    try {
      const survey = await Survey.findOne({isVisible: true});
      if (!survey)
        return res.status(404).json({message: 'No visible survey found.'});
      res.status(200).json(survey);
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  },
  getOwnSurveys: async (req,res) => {
    try {
      const surveys = await Survey.find({creator: req.user._id});
      if (!surveys)
        return res.status(404).json({message: 'No surveys created by the current owner found.'});
      res.status(200).json(surveys);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },
  createSurvey: async (req,res) => {
    const {title,description,startDate,endDate,questionIds} = req.body;
    try {
      if (!Array.isArray(questionIds) || questionIds.length < 5 || questionIds.length > 20) {
        return res.status(400).json({message: 'The number of questions must be within 5 to 20.'});
      }
      const questions = await Question.find({_id: {$in: questionIds}});
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
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          message: "Validation Error: " + err.errors.map(e => e.message).join(' '),
          errors: err.message
        });
      } else
        return res.status(500).json({message: err.message});
    }
  },
  updateSurvey: async (req,res) => {
    const {title,description,startDate,endDate,isVisible,questionIds} = req.body;
    try {
      const currentSurvey = await Survey.findById({_id: req.params.surveyId});
      if (!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if (currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to edit this survey.'});
      if (title) currentSurvey.title = title;
      if (description) currentSurvey.description = description;
      if (startDate) currentSurvey.startDate = startDate;
      if (endDate) currentSurvey.endDate = endDate;
      if (questionIds) {
        if (!Array.isArray(questionIds) || questionIds.length < 5 || questionIds.length > 20) {
          return res.status(400).json({message: 'The number of questions must be within 5 to 20.'});
        }
        const questions = await Question.find({_id: {$in: questionIds}});
        currentSurvey.questions = questions.map(q => q._id);
      }
      currentSurvey.isVisible = isVisible;
      await currentSurvey.save();
      res.status(200).json({message: 'Survey updated successfully.'});
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          message: "Validation Error: " + err.errors.map(e => e.message).join(' '),
          errors: err.message
        });
      } else
        return res.status(500).json({message: err.message});
    }
  },
  deleteSurvey: async (req,res) => {
    const {surveyId} = req.params;
    try {
      const currentSurvey = await Survey.findById({_id: surveyId});
      if (!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if (currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to delete this survey.'});
      await Survey.deleteOne({_id: surveyId,creator: req.user._id});
      res.status(200).json({message: 'Survey deleted successfully.'});
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  },
  toggleVisibility: async (req,res) => {
    const {surveyId} = req.params;
    try {
      const currentSurvey = await Survey.findById({_id: surveyId});
      if (!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if (currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to edit this survey.'});
      currentSurvey.isVisible = !currentSurvey.isVisible;
      await currentSurvey.save();
      res.status(200).json({message: 'Survey visibility toggled successfully.'});
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  },
  setPeriod: async (req,res) => {
    const {surveyId} = req.params;
    const {startDate,endDate} = req.body;
    try {
      const currentSurvey = await Survey.findById({_id: surveyId});
      if (!currentSurvey)
        return res.status(404).json({message: 'Survey not found.'});
      if (currentSurvey.creator.toString() !== req.user._id.toString())
        return res.status(403).json({message: 'You are not authorized to edit this survey.'});
      if (!startDate || !endDate)
        return res.status(400).json({message: 'Both start date and end date are required.'});
      currentSurvey.startDate = startDate;
      currentSurvey.endDate = endDate;
      await currentSurvey.save();
      res.status(200).json({message: 'Survey period set successfully.'});
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          message: "Validation Error: " + err.errors.map(e => e.message).join(' '),
          errors: err.message
        });
      } else
        return res.status(500).json({message: err.message});
    }
  },
  getOwnResponses: async (req,res) => {
  },
  pushResponse: async (req,res) => {
    const {surveyId,responses,} = req.params;
  },
  getStatistics: async (req,res) => {
  },
};