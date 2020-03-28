const express = require('express');
const User = require('../models/user');
const router = express.Router();
const crypt = require('bcryptjs');
// USER TOKEN TO PROTECT ROUTES
// const { protect } = require('../middleware/protect');
const { isLogged } = require('../middleware/isLogged');
// Passport
const passport = require('passport');


//*** Registration
router.post('/register', async (req, res, next) => {
    // Deconstrunct REQ.BODY
    let { fname, lname, email, password, pswConfirm, role } = req.body;
    //********* GLOBAL VARIABLES */
    // User match variable
    let userMatch = false;
    // err
    let err = true;
    // err array
    let errArray = [];
    //*** FIND ALLA USERS
    let myQuery = User.find({});
    // Await response
    let users = await myQuery;
    users.forEach(user => {

        if (email === user.email) {
            let emailUnique = { email: 'Email already used.' };
            errArray.push(emailUnique);
            err = true;
        }
    });
    // console.log(errArray)

    //*************** VALIDATOR FUNCTION
    function Validation(fname, lname, email, password, pswConfirm, role) {
        if (fname !== undefined && lname !== undefined && email !== undefined && password !== undefined && pswConfirm !== undefined && role !== undefined) {
            // Validator
            if (!fname) {
                let fnameErr = { fname: 'Insert First name.' };
                errArray.unshift(fnameErr);
                err = true;
            }
            if (!lname) {
                let lnameErr = { lname: 'Insert Last name.' };
                errArray.push(lnameErr);
                err = true;
            }
            if (!email) {
                let emailErr1 = { email: 'Insert Email.' };
                errArray.push(emailErr1);
                err = true;
            }
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
                let emailErr2 = { email: 'Invalid Email.' };
                errArray.push(emailErr2);
                err = true;
            }
            if (!password) {
                let pswErr1 = { password: 'Insert password.' };
                errArray.push(pswErr1);
                err = true;
            }
            if (password.length < 8) {
                let pswErr2 = { password: 'Password must be complex min 8 characters.' };
                errArray.push(pswErr2);
                err = true;
            }
            if (!(/[A-Z]/).test(password)) {
                let pswErr3 = { password: 'Password uppercase.' };
                errArray.push(pswErr3);
                err = true;
            }
            if (!(/[a-z]/).test(password)) {
                let pswErr4 = { password: 'Password lowercase.' };
                errArray.push(pswErr4);
                err = true;
            }
            if (!(/\d/).test(password)) {
                let pswErr5 = { password: 'Password numeric.' };
                errArray.push(pswErr5);
                err = true;
            }
            if (!(/\W/).test(password)) {
                let pswErr6 = { password: 'Password alphas.' };
                errArray.push(pswErr6);
                err = true;
            }
            if (pswConfirm !== password) {
                let pswErr3 = { password: 'Passwords must be equals.' };
                errArray.push(pswErr3);
                err = true;
            }
            if (!role) {
                let roleErr1 = { role: 'Insert Role.' };
                errArray.push(roleErr1);
                err = true;
            }
            if (role !== 'user' && role !== 'admin' && role !== 'publisher') {
                let roleErr2 = { role: 'Insert a valid role.' };
                errArray.push(roleErr2);
                err = true;
            }
        }

        if (errArray.length > 1) {
            // console.log(errArray)
            err = true;
            return res.status(400).json({
                success: false,
                data: errArray
            });
            // RESET ARRAY ERRORS
            errArray.length = 0;

        } else {

            // err
            err = false;
        }

    }
    // Run validation
    Validation(fname, lname, email, password, pswConfirm, role);

    // CREATE USER if err false, no errors
    if (!err) {

        //********************************** Or use passport method
        User.register(new User({ fname, lname, email, username: email, role }), password, (err, user) => {
            if (err) {
                console.log(err)
                // res.status(400).json({
                //     success: false,
                //     data: [{}],
                //     user: user
                // })
            } else {
                // Now you can redirect to home page, if api return 200
                res.status(200).json({
                    success: true,
                    data: [{}],
                    user: user
                });
                // return res.status(200).json({success:true, data: user})
                // USE PASSPORT TO AUTHENTICATE THE USER SUCCESSFULLY REGISTERED
                passport.authenticate('local')(req, res, () => {
                    // Now you can redirect to home page, if api return 200
                    return res.status(200).json({
                        success: true,
                        data: [{}],
                        user: user
                    })
                });
            }

        });

    };

});

//*********************** LOGIN POST */
router.post('/login', passport.authenticate('local'), function (req, res) {
    if(req.user){
        return res.status(200).json({ success: true });        
    }
    return res.status(400).json({ success: false });

});

//*********************** LOG OUT  */
router.get('/logout', (req, res) => {
    req.logout();

    return res.status(200).json({
        success: true
    })
});

//************************* FETCH LOGGEIN USER */
router.get('/whoisloggedin', (req, res) => {
    // console.log()
    // if(req.user !== undefined){
    // console.log(req.user.username);
    // }
    
    if (req.user !== undefined && req.isAuthenticated() === true) {
        return res.status(200).json({ isAuthenticated: true, data: req.user });
    }
    return res.status(400).json({ isAuthenticated: false, data: {} });
});

// Export
module.exports = router;