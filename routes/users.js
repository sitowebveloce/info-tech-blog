const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
// USER TOKEN TO PROTECT ROUTES
// const { protect } = require('../middleware/protect');
const { isLogged } = require('../middleware/isLogged');



//*** Registration
router.post('/register', async(req, res, next) => {
    // Deconstrunct REQ.BODY
    let { fname, lname, email, password, pswConfirm, role } = req.body;
    // console.log(fname, lname, email, password, pswConfirm, role)
    //********* GLOBAL VARIABLES */
    // User match variable
    let userMatch = false;
    // err
    let err = true;
    // err array
    let errArray = [];
    //*** FIND ALLA USERS
    let myQuery = await User.find({ email: email });
    // Await response
    let user = myQuery;
    // Check user email
    if (user.length > 0) {
        let emailUnique = { email: 'Email already used.' };
        errArray.push(emailUnique);
        return res.status(400).json({
            success: false,
            data: errArray
        });
    }
    // console.log(errArray)

    //*************** VALIDATOR FUNCTION
    // Validator
    if (!fname) {
        let fnameErr = { fname: 'Insert First name.' };
        errArray.unshift(fnameErr);
    }
    if (!lname) {
        let lnameErr = { lname: 'Insert Last name.' };
        errArray.push(lnameErr);
    }
    if (!email) {
        let emailErr1 = { email: 'Insert Email.' };
        errArray.push(emailErr1);
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
        let emailErr2 = { email: 'Invalid Email.' };
        errArray.push(emailErr2);
    }
    if (!password) {
        let pswErr1 = { password: 'Insert password.' };
        errArray.push(pswErr1);
    }
    if (password.length < 8) {
        let pswErr2 = { password: 'Password must be complex min 8 characters.' };
        errArray.push(pswErr2);
    }
    if (!(/[A-Z]/).test(password)) {
        let pswErr3 = { password: 'Password uppercase.' };
        errArray.push(pswErr3);
    }
    if (!(/[a-z]/).test(password)) {
        let pswErr4 = { password: 'Password lowercase.' };
        errArray.push(pswErr4);
    }
    if (!(/\d/).test(password)) {
        let pswErr5 = { password: 'Password numeric.' };
        errArray.push(pswErr5);
    }
    if (!(/\W/).test(password)) {
        let pswErr6 = { password: 'Password alphas.' };
        errArray.push(pswErr6);
    }
    if (pswConfirm !== password) {
        let pswErr3 = { password: 'Passwords must be equals.' };
        errArray.push(pswErr3);
    }
    if (!role) {
        let roleErr1 = { role: 'Insert Role.' };
        errArray.push(roleErr1);
    }
    if (role !== 'user' && role !== 'admin' && role !== 'publisher') {
        let roleErr2 = { role: 'Insert a valid role.' };
        errArray.push(roleErr2);
    }

    // console.log(errArray)
    // console.log(errArray.length)
    if (errArray.length > 0) {
        // console.log(errArray)
        return res.status(400).json({
            success: false,
            data: errArray
        });
        // RESET ARRAY ERRORS
        errArray.length = 0;
    }

    // CREATE USER if err false, no errors
    if (errArray.length === 0) {
        // Encryp password
        bcryptjs.genSalt(10, function(err, salt) {
            //console.log(salt)
            if (err) console.log(err);
            bcryptjs.hash(password, salt, function(err, hash) {
                if (err) console.log(err);
                // Store hash in DB
                //console.log(hash)
                password = hash;
                if (hash) {
                    User.create({
                        fname,
                        lname,
                        email,
                        username: email,
                        role,
                        password
                    }, (err, newUser) => {
                        if (err) throw err;
                        //console.log(newUser);

                        // SEND THE TOKEN AND THE COOKIE
                        sendTokenResponse(newUser, 200, res);
                    });
                }
            });
        });
    };
});

//*********************** LOGIN POST */
router.post('/login', async function(req, res) {
    const { email, password } = req.body;
    // console.log(req.body)
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Provide email or password 🥺.'
        });
    }
    // Check if email exist
    let query = await User.findOne({ email: email }).select('+password');
    let user = query;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invald credential 🥺.'
        });
    }

    // COMPARE PASSWORDS
    let comparePassword = async(password, hashPassword) => {
        let isMatch = await bcryptjs.compare(password, hashPassword);
        let checkPass = isMatch;
        if (!checkPass) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credential 🥺.'
            });
        }
        // USE EXTERNAL FUNCTION TO SEND THE COOKIE
        sendTokenResponse(user, 200, res);
    }
    comparePassword(password, user.password);
});

//*********************** LOG OUT  */
router.get('/logout', (req, res) => {
    // RESET COOKIE
    res.cookie('token', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`, {
        expires: new Date(Date.now() + 1 * 1000), //
        httpOnly: true
    });

    // RETURN 
    return res.status(200).json({
        success: true
    });
});

//************************* FETCH LOGGEIN USER */
router.get('/whoisin', isLogged, async(req, res) => {
    if (!req.user) {
        return res.status(400).json({
            success: false,
        })
    }

    let user = await User.findById(req.user.id);

    // RETURN
    return res.status(200).json({
        success: true,
        user: user
    });

});


//
// ─── GET TOKEN AND CREATE A COOKIE AND SEND RESPONSE ────────────────────────────

const sendTokenResponse = (user, statusCode, res) => {
    // Token and return
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP
    });
    // IN PRODUCTION YOU CAN ADD options.secure = true for
    // only https connections
    let options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000), // ONE DAY
        httpOnly: true
    }

    // Send cookie
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            message: `🏆 Wellcome ${user.email}`
        });
}


// Export
module.exports = router;