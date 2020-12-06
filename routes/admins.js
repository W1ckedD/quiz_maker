const express = require('express');
const adminsController = require('../controllers/admins');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// Auth
router.get('/login', adminsController.getLogin);
router.get('/register', adminsController.getRegister);
router.get('/dashboard', requireAdmin, adminsController.getDashboard);

router.post('/login', adminsController.postLogin);
router.post('/register', adminsController.postRegister);

// Classes
router.get('/manage-students', adminsController.getManageStudents);
router.get('/manage-classes/:id/edit-students', adminsController.getEditClassStudents);
router.get('/manage-classes/:id', adminsController.getEditClass);
router.get('/manage-classes', adminsController.getManageClasses);

router.post('/manage-classes/:id/edit-students', adminsController.postEditClassStudents);
router.post('/manage-classes/add-class', adminsController.postAddClass);
router.post('/manage-classes/remove-class', adminsController.postDeleteClass);

module.exports = router;