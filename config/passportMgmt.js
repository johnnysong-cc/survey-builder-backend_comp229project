/** 
 * Internal Documentation
 * passport strategy configuration
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */

const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {User} = require('../models/userModel');
module.exports = function(passport){
  passport.use(new LocalStrategy(
    async (username,password,done) => {
      try {
        const existingUser = await User.findOne({username});
        if (!existingUser)
          return done(null,false,{message: 'The username doesn\'t exist.'});
        const isPasswordMatched = await bcrypt.compare(password,existingUser.password);
        if (!isPasswordMatched)
          return done(null,false,{message: 'The password is incorrect.'});
        return done(null,existingUser,{message: 'Logged in successfully.'});
      } catch (err) {
        return done(err);
      }
    },
  ));
  passport.serializeUser((user,done) => {
    done(null,user.id);
  });
  passport.deserializeUser(async (id,done) => {
    try{
      const user = await User.findById(id);
      done(null,user);
    }catch(err){
      done(err);
    }
  });
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };
  passport.use(new JwtStrategy(jwtOptions,async (jwtPayload,done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (!user) return done(null,false);
      return done(null,user);
    } catch (err) {
      return done(err);
    }
  }));
}