const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class AccountController {
    // [GET] /account/register
    registerForm(req, res, next) {
        res.render('account/register');
    }

    // [POST] /account/register
    register(req, res, next) {
        const hash = bcrypt.hashSync(req.body.password, 10); // Số lần thuật toán chạy để hash password
        const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
        const userInfo = {
            username: req.body.username,
            fullname: req.body.fullname,
            password: hash,
            dob,
            email: req.body.email,
            permission: 0,
        };

        const user = new Account(userInfo);

        user.save()
            .then(() => res.redirect('/account/register'))
            .catch(next);
    }

    // [GET] /acccount/is-available
    async checkUsernameRegister(req, res, next) {
        const user = await Account.findOne({ username: req.query.username });
        user ? res.json(false) : res.json(true);
    }

    // [GET] /acccount/login
    login(req, res, next) {
        const ref = req.headers.referer;
        if (ref) {
            req.session.retUrl = ref;
        }

        res.render('account/login', {
            layout: false,
        });
    }

    // [POST] /acccount/login
    async checkUserLogin(req, res, next) {
        const user = await Account.findOne({ username: req.body.username });

        // Check user
        if (user === null) {
            res.render('account/login', {
                layout: false,
                errorMessage: 'Tên đăng nhập không chính xác !',
            });
        } else {
            // check password
            const isValidPassword = bcrypt.compareSync(
                req.body.password,
                user.password,
            );
            if (isValidPassword) {
                req.session.isAuth = true;

                const userInfo = {
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                    dob: user.dob,
                };

                req.session.authUser = userInfo;

                let url = req.session.retUrl || '/';
                res.redirect(url);
            } else {
                res.render('account/login', {
                    layout: false,
                    errorMessage: 'Mật khẩu không chính xác !',
                    userName: user.username,
                });
            }
        }
    }

    // [POST] /acccount/logout
    logout(req, res) {
        req.session.isAuth = false;
        req.session.authUser = null;
        res.redirect(req.headers.referer);
    }

    // [GET] /account/profile
    showProfile(req, res, next) {
        res.render('account/profile');
    }
}

module.exports = new AccountController();
