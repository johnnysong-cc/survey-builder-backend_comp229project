/**Internal Documentation
 * mongoose models for Surveys
 * Student name: Zhiyang Song
 * Student ID: 301167073
 */

const mongoose = require('../config/dbConn');
const {Schema} = mongoose;

const ResponseSchema = new Schema({
  userAnswers: [{type: Number,required: true}],
  survey: {type: Schema.Types.ObjectId,ref: 'Survey',required: true},
  createdAt: {type: Date,required: true,default: Date.now()},
  responder: {type: Schema.Types.ObjectId,ref: 'User'},
  isFromAnonymous: {type: Boolean,required: true,default: false},
  score: {type: Number,required: true,default: 0},
});
ResponseSchema.pre('save',function(next) {
  if (!this.responder) this.isFromAnonymous = true;
  next();
});
module.exports = {
  Response: mongoose.model('Response',ResponseSchema),
}