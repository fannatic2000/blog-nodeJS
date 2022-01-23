const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

module.exports = function (app) {
    var store = new MongoDBStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'f8_education_dev',
        collection: 'mySessions',
    });

    store.on('error', function (error) {
        // Also get an error here
    });

    // Session
    var sess = {
        secret: 'SECRET_KEY',
        cookie: {},
        store: store,
        resave: true,
        saveUninitialized: true,
    };
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));
};
