/** 
 * Internal Documentation
 * MongoDB Atlas connection configuration
 * Student name: Johnny Zhiyang Song
 * Student ID: 301167073
 */

const mongoose=require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNSTRING);

mongoose.connection.on('connected',()=>console.log.bind(console,'Mongoose connection successful.'));
mongoose.connection.on('error',(err)=>console.error.bind(console,'Mongoose connection error: ', err));
mongoose.connection.on('disconnected',()=>console.log.bind(console,'Mongoose connection disconnected.'));
mongoose.connection.on('reconnected',()=>console.log.bind(console,'Mongoose connection reconnected.'));
mongoose.connection.on('close',()=>console.log.bind(console,'Mongoose connection closed.'));

module.exports = mongoose;