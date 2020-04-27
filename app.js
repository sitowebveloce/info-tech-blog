//*** Requirment
const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const colors = require("colors");
const cat = require('cat-me');
const path = require("path");
const cookieParser = require('cookie-parser');
// AUTHENTICATION 
const User = require('./models/user');
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
    max: 10000 // 100 requests for 10 mins
});
app.use(limiter);
//Cors
app.use(cors());

//*** AUTHENTICATION */
// Cookie parser
app.use(cookieParser());

//*** MIDDLEWARES */
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
app.use(function(req, res, next) {
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