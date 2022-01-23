const session = require('express-session');

module.exports = function (app) {
    // Session
    var sess = {
        secret: 'SECRET_KEY',
        cookie: {},
        resave: false,
        saveUninitialized: true,
    };
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));
};
