const bcrypt = require('bcrypt');
const { Types } = require('mongoose');
const Admin = require('../models/Admin');
const Class = require('../models/Class');
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
        const { name, username, password, password2 } = req.body;
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
            name,
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
        const admin = await Admin.findOne({ username });
        if (!admin) {
            req.flash('error', messages.error422);
            return res.redirect('/admin/login');
        }
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            req.flash('error', messages.error422);
            return res.redirect('/admin/login');
        }
        req.session.isLoggedIn = true;
        req.session.admin = admin;
        return res.redirect('/admins/dashboard');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/register');
    }
};

// Manage Students
exports.getManageStudents = async (req, res) => {
    try {
        const students = await Student.find();
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

// Manage Classes
exports.getManageClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        const pairs = await Promise.all(
            classes.map(async (cl) => ({
                cl,
                teacher: await Teacher.findById(cl.teacher),
            }))
        );

        const teachers = await Teacher.find();

        return res.render('admins/manage-classes.ejs', {
            path: '/admins/manage-classes',
            teachers,
            classes: pairs,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/dashboard');
    }
};

exports.postAddClass = async (req, res) => {
    try {
        const { name, teacher: t_id } = req.body;
        const teacher = await Teacher.findById(t_id);
        const cl = await Class.create({
            name,
            teacher: Types.ObjectId(t_id),
        });
        teacher.classes = [...teacher.classes, cl._id];
        await teacher.save();
        return res.redirect('/admins/manage-classes');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-classes');
    }
};

exports.postDeleteClass = async (req, res) => {
    try {
        const { classId } = req.body;
        const cl = await Class.findById(classId);
        const teacher = await Teacher.findById(cl.teacher);
        teacher.classes = teacher.classes.filter((id) => id != classId);
        await teacher.save();
        await cl.delete();
        return res.redirect('/admins/manage-classes');
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-classes');
    }
};

exports.getEditClass = async (req, res) => {
    try {
        const { id } = req.params;
        const cl = await Class.findById(id);
        const data = await Promise.resolve({
            cl,
            teacher: await Teacher.findById(cl.teacher),
            students: await Promise.all(
                cl.students.map(async (id) => await Student.findById(id))
            ),
            // quizes: cl.quizes.map(async (id) => await Quiz.findById(id)),
        });
        return res.render('admins/edit-class.ejs', {
            path: '/admins/manage-classes',
            cl: data,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-classes');
    }
};

exports.getEditClassStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const students = await Student.find();
        const cl = await Class.findById(id);
        const data = await Promise.resolve({
            cl,
            teacher: await Teacher.findById(cl.teacher),
            students: cl.students.map(async (id) => await Student.findById(id)),
            // quizes: cl.quizes.map(async (id) => await Quiz.findById(id)),
        });
        return res.render('admins/edit-class-students.ejs', {
            path: '/admins/manage-classes',
            cl: data,
            allStudents: students,
        });
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-classes');
    }
};

exports.postEditClassStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const allStudents = await Student.find();
        const cl = await Class.findById(id);
        const { student } = req.body;
        const studs = student
            ? typeof student == 'string'
                ? [student]
                : student
            : [];
        cl.students = studs;
        await cl.save();
        await Promise.all(
            studs.map(async (id) => {
                const stud = await Student.findById(id);
                if (!stud.classes.includes(cl._id)) {
                    stud.classes = [...stud.classes, cl._id];
                }
                await stud.save();
                return stud;
            })
        );

        await Promise.all(
            allStudents
                .filter(async (stud) => !studs.includes(stud._id.toString()))
                .map(async (stud) => {
                    const classes = stud.classes.filter((id) => id != cl._id.toString());
                    // console.log(classes);
                    stud.classes = classes;
                    await stud.save();
                    return stud;
                })
        );
        return res.redirect(`/admins/manage-classes/${id}`);
    } catch (err) {
        console.log(err);
        req.flash('error', messages.error500);
        return res.redirect('/admins/manage-classes');
    }
};
