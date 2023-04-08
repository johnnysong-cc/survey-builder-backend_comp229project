/** 
 * Internal Documentation
 * user management APIs
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = {
  register: async (req,res) => {
    const {username,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,12);
    try{
      const existingUser = await User.findOne({$or: [{username: username},{email: email}]});
      if(existingUser)
        res.status(400).json({message: 'User already exists or the email is already registered'});
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        isRegistered: true
      });
      await newUser.save();
      res.status(201).json({message: 'User registered successfully'});
    } catch (err) {  
      if(err.name === 'ValidationError'){
        let message = '';
        for(const field in err.errors)
          message += err.errors[field].message;
        return res.status(400).json({
          message:"Validation Error: "+message, 
          errors: err.message
        });
      }else
        return res.status(500).json({message: err.message});
    }
  },
  login: async (req,res) => {
    const {username,password} = req.body;
    User.findOne({username: username},async (err,user) => {
      if(err)
        return res.status(500).json({message: err.message});
      if(!user)
        return res.status(401).json({message: 'User not found'});
      const isPasswordMatched = await bcrypt.compare(password,user.password);
      if(!isPasswordMatched)
        return res.status(401).json({message: 'Incorrect password'});
      const payload = {
        id:user.id,
      };
      const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN}
      );
      return res.status(200).json({
        token: token,
        message: 'Logged in successfully',
      });
    });
  },
  updateProfile: async (req,res) => {
    const { id } = req.user;
    const { username, email, oldPassword, newPassword } = req.body;
    const user = await User.findById(id);
    //#region update user profile
    if(!user)
      return res.status(404).json({message: 'User not found'});
    if(username)
      user.username = username;
    if(email)
      user.email = email;
    if(oldPassword && newPassword){
      const isPasswordMatched = await bcrypt.compare(oldPassword,user.password);
      if(!isPasswordMatched)
        return res.status(401).json({message: 'Incorrect old password'});
      user.password = await bcrypt.hash(newPassword,12);
    }
    //#endregion
    await user.save(err => {
      if(err){
        if(err.name==='ValidationError'){
          let message = '';
          for(const field in err.errors)
            message += err.errors[field].message;
          return res.status(400).json({
            message:"Validation Error: "+message, 
            errors: err.message
          });
        }else if(err.name==='MongoError' && err.code===11000){
          return res.status(400).json({message: 'Username or email already exists'});
        }else
          return res.status(500).json({message: err.message});
      }else{
        return res.status(200).json({message: 'User profile updated successfully'});
      }
    });
  },
}