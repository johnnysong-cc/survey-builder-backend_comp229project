const session=require('express-session');
const mongoSessionStore=require('connect-mongo');
const sessionConf = {
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized: false,
  cookie:{
    name: "connect-johnny.sid",
    domain:"",
    path:"",
    expires:86400000,
    httpOnly:true,
    secure:"",
    sameSite:""
  },
  store: mongoSessionStore.create({
    mongoUrl: process.env.CONNSTRING,
    ttl:2*24*60*60,
    dbName:"",
    collectionName:"comp229project-sessions",
    autoRemove: true,
    autoIndex: true,
    serialize:{},
    unserialize:{},
  })
}
module.exports = session(sessionConf);