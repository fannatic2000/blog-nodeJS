module.exports = function (req, res, next) {
    if (req.session.isAuth) {
        return next();
    }

    req.session.retUrl = req.originalUrl;
    res.redirect('/account/login');
};
