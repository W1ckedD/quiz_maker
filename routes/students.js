const express = require('express');
const studentsController = require('../controllers/students');
const requireStudent = require('../middlewares/requireStudent');

const router = express.Router();

router.get('/login', studentsController.getLogin);
router.get('/register', studentsController.getRegister);
router.get('/dashboard', requireStudent, studentsController.getDashboard);

router.post('/login', studentsController.postLogin);
router.post('/register', studentsController.postRegister);

module.exports = router;

