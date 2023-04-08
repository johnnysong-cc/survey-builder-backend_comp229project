/**
 * Internal Documentation
 * Student name: Zhiyang Song
 * Student ID: 301167073
 */
const mongoose = require('../config/dbConn');
const {Schema} = mongoose;

const UserSchema = new Schema({
  isRegistered: {type: Boolean,required: true},
  email: {type: String,unique: [true,"This email has been registered."],
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
    type: String,unique: [true,"User name must be unique."],
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
    type: String,validate: [
      {
        validator: val => val.length >= 6 && val.length <= 20,
        message: "{PATH} validation failed: the length of the password must be within 6 to 20."
      },
      {
        validator: val => {
          let hasUpper = false,hasLower = false,hasNumber = false;
          val.split('').forEach(c => {
            if (c >= 'A' && c <= 'Z') hasUpper = true;
            if (c >= 'a' && c <= 'z') hasLower = true;
            if (c >= '0' && c <= '9') hasNumber = true;
          });
          return hasUpper && hasLower && hasNumber;
        },
        message: "{PATH} validation failed: the password must contain at least an uppercase letter, a lowercase letter, and a number."
      },
      {
        validator: function(val) {
          return this.isRegistered ? val.length > 0 : true;
        },
        message: "{PATH} validation failed: the password must be present for a registered user."
      }
    ]
  },
});
module.exports = {
  User: mongoose.model('User',UserSchema)
};