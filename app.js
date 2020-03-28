//*** Requirment
const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const colors = require("colors");
const mongoose = require('mongoose');
const cat = require('cat-me');
const ejs = require("ejs");
const path = require("path");
const cookieParser = require('cookie-parser');

// AUTHENTICATION 
const User = require('./models/user');
const session = require('express-session');
const RememberMeStrategy = require('passport-remember-me');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
//*** SECURITY PACKAGES */
const mongooseSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require("cors");

//*** MONGO DB CONNECTION
const connectDB = require("./config/db");
connectDB();

//*** APP
const app = express();
//*** NODEJS SECURITY */
app.use(mongooseSanitize());
app.use(helmet());
app.use(xssClean());
app.use(hpp());
const limiter = expressRateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // 100 requests for 10 mins
});
app.use(limiter);
//Cors
app.use(cors());

//*** AUTHENTICATION */
const cookieExpirationDate = new Date();
const cookieExpirationDays = 1;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);
// Cookie parser
app.use(cookieParser('Please, make me strong, give me the power to destroy enemies!'));
app.use(session({
  secret: 'Please, make me strong, give me the power to destroy enemies!',
  resave: false, // true for flash msg
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: cookieExpirationDate // use expires instead of maxAge
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function (user, done) {
  // console.log(user)
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use((req, res, next) => {
  //  console.log('req.session', req.session);
  return next();
});
// Passport Create req.user
app.use(function (req, res, next) {
  res.locals.user = req.user;
  // console.log(req.user);
  //*************** NEXT */
  next();
});

//*** MIDDLEWARES */
// Default engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Static
app.use(express.static(path.join(__dirname, "public")));
// React front end
app.use(express.static(path.join(__dirname, 'reactApp/build1')));


//Route

let index = require("./routes/index");
let users = require('./routes/users');

app.use('/user', users);
app.use("/", index);

// 404
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(500).json({ error: 'Server error.' })
});

//==================== ERROR HANDLER MIDDLEWARE
//=== IMPORTANT: use this AFTHER THE ROUTE YOU WANT TO USE 

//*** PORT
let PORT = process.env.PORT;

// Listener
const server = app.listen(PORT, () => {
  console.log(`${cat()}`);
  console.log(`Server running on port ${PORT}`.blue);
});
