/** Internal Documentation
 * mongoose models for Surveys
 * Student name: Zhiyang Song
 * Student ID: 301167073
 */

const mongoose = require('../config/dbConn');
const {Question} = require('./questionModel');
const {Schema} = mongoose;
const ResponseSchema = new Schema({
  userAnswers: [{type: Number,required: true}],
  createdAt: {type: Date,required: true,default: Date.now()},
  responder: {type: Schema.Types.ObjectId,ref: 'User'},
  isFromAnonymous: {type: Boolean,required: true,default: false},
  grade: {type: Number,required: true,default: 0},
});
ResponseSchema.pre('save',function(next) {
  if(!this.responder) this.isFromAnonymous = true;
  next();
});
ResponseSchema.pre('save',async function(next) {
  const parentSurvey = await Survey.findOne({"responses": thid._id});
  console.log("parentSurvey: ",parentSurvey);
  const correctAnswers = parentSurvey.correctAnswers;
  let gradeOnebyOne = 0;
  for(let i = 0;i < this.userAnswers.length;i++) {
    if(this.userAnswers[i] === correctAnswers[i]) gradeOnebyOne++;
  }
  this.grade = gradeOnebyOne / correctAnswers.length;
})
const SurveySchema = new Schema({
  title: {type: String,required: true,unique: [true,'The same survey title already exists.']},
  description: {type: String},
  creator: {type: Schema.Types.ObjectId,ref: 'User',required: true},
  startDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  endDate: {
    type: Date,
    default: () => {return Date.now() + process.env.SURVEY_ALIVE_DAYS * 24 * 60 * 60 * 1000;}
  },
  isVisible: {type: Boolean,required: true,default: true},
  isExpired: {type: Boolean,required: true,default: false},
  questions: {
    type: [{type: Number,ref: 'Question',required: true}],
    required: true,
    validate: [
      {
        validator: function(val) {
          console.log(this.questions)
          return val.length >= 5 && val.length <= 20;
        },
        message: "{PATH} validation failed: the number of questions must be within 5 to 20."
      }
    ]
  },
  correctAnswers: {
    type: [{type: Number,required: true, default: 0}],
  },
  responses: [{type: Schema.Types.ObjectId,ref: 'Response'}],
});
SurveySchema.pre('save',function(next) {
  if(this.endDate <= Date.now()) this.isExpired = true;
  next();
});
SurveySchema.pre('save', async function(next) {
  this.correctAnswers = [];
  for(qid of this.questions) {
    const question = await Question.findById({_id: qid});
    if(!question) return next(new Error('Question not found.'));
    if(question.questionType==='MCQ') {
      const correctIndex = question.choices.findIndex(c=>c.correctAnswer==true);
      this.correctAnswers.push(correctIndex);
    }else if(question.questionType==='TFQ') {
      const correctIndex = question.isCorrect ? 1 : 0;
      this.correctAnswers.push(correctIndex);
    }
  }
  next();
})
module.exports = {
  Survey: mongoose.model('Survey',SurveySchema)
};