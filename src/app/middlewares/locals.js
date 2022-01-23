module.exports = function (req, res, next) {
    if (!req.session.isAuth) {
        req.session.isAuth = false;
    }

    res.locals.isAuth = req.session.isAuth;
    res.locals.authUser = req.session.authUser;
    next();
};
