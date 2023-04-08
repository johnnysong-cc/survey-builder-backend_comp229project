/** 
 * Internal Documentation
 * mongoose models for Question
 * Student name: Zhiyang Song
 * Student ID: 301167073
 */
const mongoose = require('../config/dbConn');
const {Schema} = mongoose;

const QuestionSchema = new Schema({
  questionText: {type: String,required: true},
  questionType: {type: String,required: true,enum: ['MCQ','TFQ']},
  createdBy: {type: Schema.Types.ObjectId,ref: 'User',required: true},
  createdAt: {type: Date,required: true,default: Date.now},
  choices: {
    type: [{
      choiceText: {type: String},
      correctAnswer: {type: Boolean,default: false},
    }],
    validate: [
      {
        validator: function(val) {
          return this.questionType === 'multiple-choice' ? val.length >= 2 && val.length <= 4 : true;
        },
        message: "{PATH} validation failed: the number of choices must be within 2 to 4."
      },
      {
        validator: function(val) {
          return this.questionType === 'multiple-choice' ? val.filter(choice => choice.correctAnswer).length === 1 : true;
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
    ]
  },
  isCorrect: {
    type: Boolean,validate: [
      {
        validator: function(val) {
          return this.questionType === 'true-or-false' ? val !== undefined : true;
        },
        message: "{PATH} validation failed: `isCorrect` must have a value to indicate if the statement is correct or not."
      }
    ]
  },
});

module.exports = {
  Question: mongoose.model('Question',QuestionSchema)
};