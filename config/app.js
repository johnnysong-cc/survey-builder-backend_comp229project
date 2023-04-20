/** 
 * Internal Documentation
 * app running environment configuration
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */

require("dotenv").config();
const path = require('path');
const express = require('express');
const session = require('./sessionMgmt');
const flash = require("connect-flash");
const logger = require('morgan');
const passport = require('passport');
require('./passportMgmt')(passport);
const surveysRouter = require('../routes/surveyRoute');
const usersRouter = require('../routes/usersRoute');
const questionRouter = require('../routes/questionRoute');

const app = express();
app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', usersRouter(passport));
app.use('/questions',questionRouter(passport));
app.use('/surveys',surveysRouter(passport));

module.exports = {
  app,
};
