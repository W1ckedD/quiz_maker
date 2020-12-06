const express = require('express');

const teachersController = require('../controllers/teachers');
const requireTeacher = require('../middlewares/requireTeacher');

const router = express.Router();

router.get('/login', teachersController.getLogin);
router.get('/register', teachersController.getRegister);
router.get('/dashboard', requireTeacher, teachersController.getDashboard);

router.post('/register', teachersController.postRegister);
router.post('/login', teachersController.postLogin);

module.exports = router;