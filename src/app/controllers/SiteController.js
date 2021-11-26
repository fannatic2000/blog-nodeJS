const Course = require('../models/Courses');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    // [GET] /
    home(req, res, next) {
        /* Cách viết với Callback */
        // Course.find({}, (err, courses) => {
        //     if (err) {
        //         res.status(400).json({ error: 'message'});
        //     }
        //     res.json(courses);
        // })

        /* Cách viết với Promise */
        Course.find({})
            .then((courses) => {
                //course = [{}, {}, {}]
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                });
            })
            .catch(next); // next là hàm next(err) chuyển lỗi sang middleware

        //res.render('home');
    }

    // [GET] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
