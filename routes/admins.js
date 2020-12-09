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
// router.get(
//     '/manage-students',
//     requireAdmin,
//     adminsController.getManageStudents
// );
// router.get(
//     '/manage-classes/:id/edit-students',
//     requireAdmin,
//     adminsController.getEditClassStudents
// );
// router.get('/manage-classes/:id', requireAdmin, adminsController.getEditClass);
// router.get('/manage-classes', requireAdmin, adminsController.getManageClasses);

// router.post(
//     '/manage-classes/:id/edit-students',
//     requireAdmin,
//     adminsController.postEditClassStudents
// );
// router.post(
//     '/manage-classes/add-class',
//     requireAdmin,
//     adminsController.postAddClass
// );
// router.post(
//     '/manage-classes/remove-class',
//     requireAdmin,
//     adminsController.postDeleteClass
// );

module.exports = router;
