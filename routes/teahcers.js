const express = require('express');

const teachersController = require('../controllers/teachers');
const requireTeacher = require('../middlewares/requireTeacher');

const router = express.Router();

router.post(
    '/question-pools/add-question-pool',
    teachersController.postAddQuestionPool
);
router.post(
    '/question-pools/delete-question-pool',
    teachersController.postDeleteQuestionPool
);
router.get(
    '/question-pools',
    requireTeacher,
    teachersController.getQuestionPool
);

router.get('/login', teachersController.getLogin);
router.get('/register', teachersController.getRegister);
router.get('/dashboard', requireTeacher, teachersController.getDashboard);

router.post('/register', teachersController.postRegister);
router.post('/login', teachersController.postLogin);

module.exports = router;
