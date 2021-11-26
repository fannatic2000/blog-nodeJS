var express = require('express');
var router = express.Router();

const newsController = require('../app/controllers/NewsController');

// Nên đặt đường dẫn '/' ở cuối (do check từ trên xuống khớp thì lấy)
router.get('/:slug', newsController.show);
router.get('/', newsController.index);

module.exports = router;
