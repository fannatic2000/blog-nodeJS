const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const app = express();
const port = 3000;

const route = require('./routes');

// khai báo đường dẫn tới thư mục chứa các tập tin tĩnh
// Có tải các tập tin qua đường dẫn http://localhost:3000/img/abc.png
// Note: Load CSS cho HTML đường dẫn sẽ bắt đầu từ đây
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true
})); // midleware xử lý khi gửi từ Form code HTML lên (Client -> Server)
app.use(express.json()); // midleware xử lý khi gửi từ code JS lên (Client -> Server)

// HTTP logger
//app.use(morgan('combined'));

// Template engine
app.engine('hbs', handlebars({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

// Routes Init
route(app);

// 127.0.0.1 - localhost
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});