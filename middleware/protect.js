const jwt = require('jsonwebtoken');
const User = require('../models/user');
//**** PARSE COOKIE FUNCTION */
function parseCookies(request) {
    let list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}


// Protect routes
exports.protect = async (req, res, next) => {
    // Token init
    // console.log(req.headers)
    // console.log(req.headers.cookie)
    // PARSE COOKIES
    let tk = parseCookies(req);
    let token = tk.cookieToken;
    // Make sure token exists
    if (!token) {
        return next(res.status(401).json({ authorized: false, token: {}, message: 'Not Authorized, login first.' }))
    }
    // VERIFY TOKEN VALIDATION
    try {
        // extract payload
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        // Extract user id from decoded, Find user in the db
        // and set req.user (current loggedin user)
        req.user = await User.findById(decoded.id);
        res.locals.user = req.user;
        console.log(res.locals.user);

        // Next
        next()
    }
    catch (err) {
        if (err) console.log(err);
        return next(res.status(401).json({ authorized: false, token: {}, message: err }))
    }

}