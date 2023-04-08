/**
 * Internal Documentation
 * mongoose models for Survey
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */

const mongoose = require('../config/dbConn');
const {Question} = require('./questionModel');
const {User} = require('./userModel');
const {Schema} = mongoose;

const ResponseSchema = new Schema({
  userAnswers: [{type: Number,required: true}],
  createdAt: {type: Date,required: true,default: Date.now},
  responder: {type: Schema.Types.ObjectId,ref: 'User',required: true}
});

const SurveySchema = new Schema({
  title: {type: String,required: true},
  description: {type: String},
  creator: {type: Schema.Types.ObjectId,ref: 'User',required: true},
  startDate: {
    type: Date,required: true,default: Date.now,
    validate: [{
      validator: function(val) {
        return val >= Date.now();
      },
      message: "{PATH} validation failed: the starting date and time must be in the future."
    }]
  },
  endDate: {type: Date,required: true},
  isVisible: {type: Boolean,required: true,default: true},
  isExpired: {type: Boolean,required: true,default: false},
  questions: {
    type: [{type: Schema.Types.ObjectId,ref: 'Question',required: true}],
    required: true,
    unique: true,
    validate: [
      {
        validator: function(val) {
          return val.length >= 5 && val.length <= 20;
        },
        message: "{PATH} validation failed: the number of questions must be within 5 to 20."
      }
    ]
  },
  responses: [{type: Schema.Types.ObjectId,ref: 'Response'}],
});
SurveySchema.pre('save',function(next) {
  if(this.endDate <= Date.now()) {
    this.isExpired = true;
  }
});


module.exports = {
  Response: mongoose.model('Response',ResponseSchema),
  Survey: mongoose.model('Survey',SurveySchema)
};