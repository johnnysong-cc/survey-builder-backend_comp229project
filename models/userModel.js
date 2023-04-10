/** Internal Documentation
 * mongoose models for Users
 * Student name: Zhiyang Song
 * Student ID: 301167073
 */
const mongoose = require('../config/dbConn');
const {Schema} = mongoose;

//#region User Schema
const UserSchema = new Schema({
  isRegistered: {type: Boolean,required: true},
  email: {
    type: String,unique: [true,"This email has been registered."],
    validate: [
      {
        validator: val => {
          let atSignIndex = val.indexOf('@');
          let dotIndex = val.lastIndexOf('.');
          return atSignIndex > 0 && dotIndex > atSignIndex;
        },
        message: "{PATH} validation failed: wrong format of email address."
      },
      {
        validator: function(val) {
          return this.isRegistered ? val.length > 0 : true;
        },
        message: "{PATH} validation failed: the email must be present for a registered user."
      }
    ]
  },
  username: {
    type: String,
    unique: [true,"User name must be unique."],
    validate: [
      {
        validator: function(val) {
          return this.isRegistered ? val.length > 0 : true;
        },
        message: "{PATH} validation failed: the user name must be present for a registered user."
      }
    ]
  },
  password: {
    type: String,
    //the validation rules are broken by bcrypt and should be deprecated when bcrypt is used
  },
});
//#endregion
//#region Export the mongoose models
module.exports = {
  User: mongoose.model('User',UserSchema)
};