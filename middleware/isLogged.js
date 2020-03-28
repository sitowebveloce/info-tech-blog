exports.isLogged = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(res.status(401).json({ isAuthorized: false, data: {}, message: 'Not Authorized, login first.' }))
    }
    next();
}