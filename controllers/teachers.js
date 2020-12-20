const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher');
const QuestionPool = require('../models/QuestionPool');
const messages = require('../utils/messages');

// Auth

exports.getLogin = (req, res) => {
    return res.render('teachers/login.ejs', { path: '/login' });
};

exports.getRegister = (req, res) => {
    return res.render('teachers/register.ejs', { path: '/register' });
};

exports.getDashboard = (req, res) => {
    return res.render('teachers/dashboard.ejs', { path: '/dashboard' });
};

exports.postRegister = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            username,
            password,
            password2,
        } = req.body;
        if (password.length < 6) {
            req.flash('error', messages.passwordLength);
            return res.redirect('/teachers/register');
        }
        if (password != password2) {
            req.flash('error', messages.passwordMatch);
            return res.redirect('/teachers/register');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const teacher = await Teacher.create({
            first_name,
            last_name,
            username,
            password: hashedPassword,
        });
        req.session.isLoggedIn = true;
        req.session.teacher = teacher;
        return res.redirect('/teachers/dashboard');
    } catch (err) {
        if (err.code === 11000) {
            req.flash('error', messages.error409);
            return res.redirect('/teachers/register');
        }
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/register');
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const teacher = await Teacher.findOne({ where: { username } });
        if (!teacher) {
            req.flash('error', messages.error422);
            return res.redirect('/teachers/login');
        }
        const match = await bcrypt.compare(password, teacher.password);
        if (!match) {
            req.flash('error', messages.error422);
            return res.redirect('/teachers/login');
        }
        req.session.isLoggedIn = true;
        req.session.teacher = teacher;
        return res.redirect('/teachers/dashboard');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/register');
    }
};

exports.getQuestionPool = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.session.teacher.id);
        const pools = await teacher.getQuestionPools();
        return res.render('teachers/question-pools.ejs', {
            path: '/teachers/question-pools',
            pools,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/dashboard');
    }
};

exports.postAddQuestionPool = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.session.teacher.id);
        const { name } = req.body;
        const questionPool = await QuestionPool.create({ name });
        await teacher.addQuestionPool(questionPool);
        return res.redirect('/teachers/question-pools');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/question-pools');
    }
};

exports.postDeleteQuestionPool = async (req, res) => {
    try {
        const { poolId } = req.body;
        const pool = await QuestionPool.findByPk(poolId);
        await pool.destroy();
        return res.redirect('/teachers/question-pools');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/question-pools');
    }
};
