const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const messages = require('../utils/messages');

// Auth
exports.getLogin = (req, res) => {
    return res.render('admins/login.ejs', { path: '/admins/login' });
};

exports.getRegister = (req, res) => {
    req.flash('msg', 'Welcome');
    return res.render('admins/register.ejs', { path: '/admins/register' });
};

exports.getDashboard = (req, res) => {
    return res.render('admins/dashboard.ejs', { path: '/admins/dashboard' });
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

// Manage Courses
exports.getManageCourses = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            order: [['last_name', 'ASC']],
        });
        const courses = await Course.findAll();
        const data = await Promise.all(
            courses.map(async (course) => ({
                id: course.id,
                name: course.name,
                teacher: await course.getTeacher(),
            }))
        );
        return res.render('admins/manage-courses.ejs', {
            path: '/admins/manage-courses',
            teachers,
            courses: data,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/dashboard');
    }
};

exports.postAddCourse = async (req, res) => {
    try {
        const { name, teacherId } = req.body;
        const teacher = await Teacher.findByPk(teacherId);
        const course = await Course.create({ name });
        teacher.addCourse(course);
        return res.redirect('/admins/manage-courses');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-courses');
    }
};

exports.getEditCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id);
        const data = await Promise.resolve({
            id: course.id,
            name: course.name,
            teacher: await Teacher.findByPk(course.TeacherId),
            students: await course.getStudents(),
        });
        return res.render('admins/edit-course.ejs', {
            path: '/admins/manage-courses',
            course: data,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-courses');
    }
};

exports.getEditCourseStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const allStudents = await Student.findAll();
        const course = await Course.findByPk(id);
        const data = await Promise.resolve({
            name: course.name,
            students: await course.getStudents(),
            teacher: await course.getTeacher(),
        });
        return res.render('admins/edit-course-students.ejs', {
            path: '/admins/manage-course',
            course: data,
            allStudents
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-courses');
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
