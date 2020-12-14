const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const messages = require('../utils/messages');

// Auth
exports.getLogin = (req, res) => {
    return res.render('admins/login.ejs', { path: '/login' });
};

exports.getRegister = (req, res) => {
    req.flash('msg', 'Welcome');
    return res.render('admins/register.ejs', { path: '/register' });
};

exports.getDashboard = (req, res) => {
    return res.render('admins/dashboard.ejs', { path: '/dashboard' });
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
            return res.redirect('/admins/register');
        }
        if (password != password2) {
            req.flash('error', messages.passwordMatch);
            return res.redirect('/admins/register');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = await Admin.create({
            first_name,
            last_name,
            username,
            password: hashedPassword,
        });
        req.session.isLoggedIn = true;
        req.session.admin = admin;
        return res.redirect('/admins/dashboard');
    } catch (err) {
        if (err.code === 11000) {
            req.flash('error', messages.error409);
            return res.redirect('/admins/register');
        }
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/register');
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) {
            req.flash('error', messages.error422);
            return res.redirect('/admins/login');
        }
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            req.flash('error', messages.error422);
            return res.redirect('/admins/login');
        }
        req.session.isLoggedIn = true;
        req.session.admin = admin;
        return res.redirect('/admins/dashboard');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/login');
    }
};

// Manage Students
exports.getManageStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        return res.render('admins/manage-students.ejs', {
            path: '/admins/manage-students',
            students,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/dashboard');
    }
};
