/** 
 * Internal Documentation
 * mongoose models for Question
 * Student name: Zhiyang Song
 * Student ID: 301167073
 */

const mongoose = require('../config/dbConn');
const {Schema} = mongoose;
const {AutoIncrementID} = require('@typegoose/auto-increment');

const QuestionSchema = new Schema({
  _id: {type: Number},
  questionText: {type: String,required: true,unique: [true,'The same question already exists.']},
  questionType: {type: String,required: true,enum: ['MCQ','TFQ']},
  createdBy: {type: Schema.Types.ObjectId,ref: 'User',required: true},
  createdAt: {type: Date,required: true,default: Date.now},
  choices: {
    type: [{
      choiceText: {type: String,required:true},
      correctAnswer: {type: Boolean,default: false,required:true},
    }],
    validate: [
      {
        validator: function(val) {
          return this.questionType === 'MCQ' ? (this.choices && val.length > 0) : true;
        },
        message: "{PATH} validation failed: the choices must be present for a multiple choice question."
      },
      {
        validator: function(val) {
          return this.questionType === 'MCQ' ? (val.length >= 2 && val.length <= 4) : true;
        },
        message: "{PATH} validation failed: the number of choices must be within 2 to 4."
      },
      {
        validator: function(val) {
          return this.questionType === 'MCQ' ? (val.filter(choice => choice.correctAnswer).length === 1) : true;
        },
        message: "{PATH} validation failed: only one choice of a multiple choice question must be correct."
      },
      {
        validator: function(val) {
          let uniqueChoices = new Set();
          val.forEach(choice => {
            uniqueChoices.add(choice.choiceText);
          });
          return uniqueChoices.size === val.length;
        },
        message: "{PATH} validation failed: duplicate choices detected."
      }
    ],
    default: []
  },
  isCorrect: {
    type: Boolean,validate: [
      {
        validator: function(val) {
          return this.questionType === 'TFQ' ? (this.choices.length===0) : true;
        },
        message: "{PATH} validation failed: `isCorrect` must be present for a true/false question and there must not be choice for it."
      }
    ],
    default: false
  },
});

QuestionSchema.plugin(AutoIncrementID,{startAt: 1000});
module.exports = {
  Question: mongoose.model('Question',QuestionSchema)
};