/** 
 * Internal Documentation
 * user management APIs
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/userModel');
module.exports = {
  register: async (req,res) => {
    let {username,email,password} = req.body;
    if (req.headers['content-type'].startsWith('multipart/form-data')) {
      username = req.body.username;
      email = req.body.email;
      password = req.body.password;
    }
    if (!username || !email || !password)
      return res.status(400).json({message: 'All the fields are required.'});
    try {
      const hashedPassword = await bcrypt.hash(password,12);
      const existingUser = await User.findOne({$or: [{username: username},{email: email}]});
      if (existingUser)
        return res.status(400).json({message: 'User already exists or the email is already registered'});
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        isRegistered: true
      });
      await newUser.save();
      res.status(201).json({message: 'User registered successfully'});
    } catch (err) {  
      if (err.name === 'ValidationError') {
        let message = '';
        for (const field in err.errors)
          message += err.errors[field].message;
        return res.status(400).json({
          message: "Validation Error: " + message,
          errors: err.message
        });
      } else {
        console.log(err);
        return res.status(500).json({message: err.message});
      }
    }
  },
  login: async (req,res) => {
    let {username,password} = req.body;
    //#region Compatibility for form-data
    if (req.headers['content-type'].startsWith('multipart/form-data')) {
      username = req.body.username;
      password = req.body.password;
    }
    const existingUser = await User.findOne({username: username}).exec().catch((err) => {
      return res.status(500).json({message: err.message});
    });
    if (!existingUser)
      return res.status(401).json({message: 'User not found'});
    const isPasswordMatched = await bcrypt.compare(password,existingUser.password);
    if (!isPasswordMatched)
      return res.status(401).json({message: 'Incorrect password'});
    const payload = {
      id: existingUser.id,
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
  },
  updateProfile: async (req,res) => {
    console.log(req.user);
    const {username,email,oldPassword,newPassword} = req.body;
    const currentUser = await User.findById(req.user._id);
    if (!currentUser)
      return res.status(404).json({message: 'User not found'});
    if (username)
      currentUser.username = username;
    if (email)
      currentUser.email = email;
    if (oldPassword && newPassword) {
      const isPasswordMatched = await bcrypt.compare(oldPassword,currentUser.password);
      if (!isPasswordMatched)
        return res.status(401).json({message: 'Incorrect old password'});
      currentUser.password = await bcrypt.hash(newPassword,12);
    }
    await currentUser.save().catch(err => {
      if (err) {
        if (err.name === 'ValidationError') {
          let message = '';
          for (const field in err.errors)
            message += err.errors[field].message;
          return res.status(400).json({
            message: "Validation Error: " + message,
            errors: err.message
          });
        } else if (err.name === 'MongoError' && err.code === 11000) {
          return res.status(400).json({message: 'Username or email already exists'});
        } else
          return res.status(500).json({message: err.message});
      } else {
        return res.status(200).json({message: 'User profile updated successfully'});
      }
    });
    return res.status(200).json({message: 'User profile updated successfully'});
  },
};