const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const messages = require('../utils/messages');

exports.getLogin = (req, res) => {
    return res.render('students/login.ejs', { path: '/login' });
};

exports.getRegister = (req, res) => {
    return res.render('students/register.ejs', { path: '/register' });
};

exports.getDashboard = (req, res) => {
    return res.render('students/dashboard.ejs', { path: '/dashboard' });
};

exports.postRegister = async (req, res) => {
    try {
        const { name, username, password, password2 } = req.body;
        if (password.length < 6) {
            req.flash('error', messages.passwordLength);
            return res.redirect('/students/register');
        }
        if (password != password2) {
            req.flash('error', messages.passwordMatch);
            return res.redirect('/students/register');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const student = await Student.create({ name, username, password: hashedPassword });
        req.session.isLoggedIn = true;
        req.session.student = student;
        return res.redirect('/students/dashboard');
    } catch (err) {
        if (err.code === 11000) {
            req.flash('error', messages.error409);
            return res.redirect('/students/register');
        }
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/students/register');
    }
}

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const student = await Student.findOne({ username });
        if (!student) {
            req.flash('error', messages.error422);
            return res.redirect('/students/login');
        }
        const match = await bcrypt.compare(password, student.password);
        if (!match) {
            req.flash('error', messages.error422);
            return res.redirect('/students/login');
        }
        req.session.isLoggedIn = true;
        req.session.student = student;
        return res.redirect('/students/dashboard');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/students/register');      
    }
}