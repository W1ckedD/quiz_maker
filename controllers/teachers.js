const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher');
const QuestionPool = require('../models/QuestionPool');
const messages = require('../utils/messages');
const Question = require('../models/Question');
const QuestionImage = require('../models/QuestionImage');

// Auth

exports.getLogin = (req, res) => {
    if (req.session.teacher) {
        return res.redirect('/teachers/dashboard');
    }
    return res.render('teachers/login.ejs', { path: '/login' });
};

exports.getRegister = (req, res) => {
    if (req.session.teacher) {
        return res.redirect('/teachers/dashboard');
    }
    return res.render('teachers/register.ejs', { path: '/register' });
};

exports.getDashboard = (req, res) => {
    return res.render('teachers/dashboard.ejs', {
        path: '/teachers/dashboard',
    });
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

// Profile

exports.getEditProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.session.teacher.id);
        return res.render('teachers/edit-profile.ejs', {
            path: '/teachers/dashboard',
            teacher,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/dashboard');
    }
};

exports.postUpdateProfileImg = async (req, res) => {
    try {
        const file = req.file;
        const arr = file.path.split('uploads');
        const path = '/uploads' + arr[arr.length - 1];
        const teacher = await Teacher.findByPk(req.session.teacher.id);
        teacher.img_url = path;
        await teacher.save();
        return res.redirect('/teachers/profile');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/profile');
    }
};

exports.postUpdateProfile = async (req, res) => {
    try {
        const { first_name, last_name } = req.body;
        const teacher = await Teacher.findByPk(req.session.teacher.id);
        teacher.first_name = first_name;
        teacher.last_name = last_name;
        await teacher.save();
        return res.redirect('/teachers/profile');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/profile');
    }
};

exports.postUpdatePassword = async (req, res) => {
    try {
        const { old_password, new_password, new_password2 } = req.body;
        if (old_password.length < 6) {
            req.flash('error', messages.passwordInvalid);
            return res.redirect('/teachers/profile');
        }
        if (new_password.length < 6) {
            req.flash('error', messages.passwordLength);
            return res.redirect('/teachers/profile');
        }
        if (new_password != new_password2) {
            req.flash('error', messages.passwordMatch);
            return res.redirect('/teachers/profile');
        }
        const teacher = await Teacher.findByPk(req.session.teacher.id);
        const match = await bcrypt.compare(old_password, teacher.password);
        if (!match) {
            req.flash('error', messages.passwordInvalid);
            return res.redirect('/teachers/profile');
        }
        const hashedPassword = await bcrypt.hash(new_password, 12);
        teacher.password = hashedPassword;
        await teacher.save();
        req.flash('success', messages.passwordChanged);
        return res.redirect('/teachers/profile');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/profile');
    }
};

// Question pools

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

exports.getQuestionPoolById = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.session.teacher.id);
        const { id } = req.params;
        const questionPools = await teacher.getQuestionPools();
        const pool = questionPools.find((p) => p.id == id);
        const tQuestions = await pool.getQuestions();
        return res.render('teachers/question-pool.ejs', {
            path: '/teachers/question-pools',
            pool,
            tQuestions,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/question-pools');
    }
};

exports.getAddQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        return res.render('teachers/add-question.ejs', {
            path: '/teachers/question-pools',
            id,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/question-pools');
    }
};

exports.postAddTQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await QuestionPool.findByPk(id);
        const file = req.file;
        const { title } = req.body;
        const question = await Question.create({ title });
        const arr = file.path.split('uploads');
        const path = '/uploads' + arr[arr.length - 1];
        const questionImg = await QuestionImage.create({ url: path });
        await question.setQuestionImage(questionImg);
        await pool.addQuestion(question);
        return res.redirect('/teachers/question-pools/' + id)
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/teachers/question-pools');
    }
}