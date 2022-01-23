const handlebars = require('express-handlebars');
const path = require('path');

function viewHbs(app) {
    // Template engine
    app.engine(
        'hbs',
        handlebars({
            defaultLayout: 'main.hbs',
            // layoutsDir: 'view/_layouts',
            // partialsDir: 'view/_partials',
            extname: '.hbs',
            helpers: require('../../helpers/handlebars'),
        }),
    );
    app.set('view engine', 'hbs');
    app.set('views', path.join('src/resources', 'views'));
}

module.exports = viewHbs;
