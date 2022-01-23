const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

const SortMiddleware = require('./app/middlewares/sortMiddleware');
const localsMiddleware = require('./app/middlewares/locals');
const session = require('./app/middlewares/session');
const viewHbs = require('./app/middlewares/viewHbs');
const handleError = require('./app/middlewares/error');

const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

// khai báo đường dẫn tới thư mục chứa các tập tin tĩnh
// Note: Load CSS, Js cho HTML đường dẫn sẽ bắt đầu từ đây
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
); // midleware xử lý khi gửi từ Form code HTML lên (Client -> Server)
app.use(express.json()); // midleware xử lý khi gửi từ code JS lên (Client -> Server)

// Init session
session(app);

// Override method
app.use(methodOverride('_method'));

// custom middlewares
app.use(localsMiddleware);
app.use(SortMiddleware);

// HTTP logger
//app.use(morgan('combined'));

// Handlebar
viewHbs(app);

// Routes Init
route(app);
handleError(app);

// 127.0.0.1 - localhost
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
