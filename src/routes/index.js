const newsRouter = require('./news');
const coursesRouter = require('./courses');
const siteRouter = require('./site');
const meRouter = require('./me');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/courses', coursesRouter);
    app.use('/me', meRouter);
    app.use('/', siteRouter);
    app.use(function (req, res) {
        res.json({ err: 'page not found 404' });
    });
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
}

module.exports = route;
