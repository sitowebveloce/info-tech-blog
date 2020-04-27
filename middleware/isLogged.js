const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isLogged = async(req, res, next) => {

    // Init token variable
    let token;
    // Header authorization
    let headerAuth = req.headers.authorization;
    // Check html header
    if (headerAuth && headerAuth.startsWith('Bearer')) {
        // Extract token from the header
        token = headerAuth.split(' ')[1];
    }
    // Use also the cookie to extract the token
    // this come from cookie-parser
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    // Make sure token exist
    // console.log(token)
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized 🥺.'
        });
    }
    // Verify token
    try {
        // Extract payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // ─── SET REQ USER VARIABLE ───────────────────────────────────────
        req.user = await User.findById(decoded.id);
        next()

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            msg: 'Not authorized 🥺.'
        });
    }
}