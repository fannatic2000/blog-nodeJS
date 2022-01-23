const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const pagination = require('../../util/pagination');

class SiteController {
    // [GET] /
    home(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        if (page < 0) {
            page = 1;
        }

        Promise.all([
            Course.find({}).enabledPagination(page, pagination.perPage),
            Course.count(),
        ])
            .then(([courses, totalCourses]) => {
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                    configPagination: pagination.configPagination(
                        page,
                        totalCourses,
                    ),
                });
            })
            .catch(next); // next là hàm next(err) chuyển lỗi sang middleware
    }

    // [GET] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
