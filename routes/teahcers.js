const express = require('express');
const multer = require('multer');
const path = require('path');

const teachersController = require('../controllers/teachers');
const requireTeacher = require('../middlewares/requireTeacher');

// multer config

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const teacher_id = req.session.teacher.id;
        cb(
            null,
            path.join(__dirname, '../', 'uploads', 'teachers', 'profiles')
        );
    },
    filename: (req, file, cb) => {
        const teacher_id = req.session.teacher.id;
        const arr = file.originalname.split('.');
        const extention = arr[arr.length - 1];
        cb(
            null,
            'teacher=' +
                teacher_id +
                '*' +
                new Date().toISOString() +
                '.' +
                extention
        );
    },
});

const profileUpload = multer({ storage: profileStorage });

const questionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const teacher_id = req.session.teacher.id;
        cb(
            null,
            path.join(__dirname, '../', 'uploads', 'teachers', 'questions')
        );
    },
    filename: (req, file, cb) => {
        const teacher_id = req.session.teacher.id;
        const arr = file.originalname.split('.');
        const extention = arr[arr.length - 1];
        cb(
            null,
            'teacher=' +
                teacher_id +
                '*' +
                new Date().toISOString() +
                '.' +
                extention
        );
    },
})

const questionUpload = multer({ storage: questionStorage });

const router = express.Router();

// Question Pool

router.post(
    '/question-pools/add-question-pool',
    requireTeacher,
    teachersController.postAddQuestionPool
);
router.post(
    '/question-pools/delete-question-pool',
    requireTeacher,
    teachersController.postDeleteQuestionPool
);

router.post(
    '/question-pools/:id/add-tQuestion',
    requireTeacher,
    questionUpload.single('question_img'),
    teachersController.postAddTQuestion
);

router.get(
    '/question-pools/:id/add-question',
    requireTeacher,
    teachersController.getAddQuestion
);
router.get(
    '/question-pools/:id',
    requireTeacher,
    teachersController.getQuestionPoolById
);
router.get(
    '/qustion-pools/:id/add-question',
    requireTeacher,
    teachersController.getAddQuestion
);
router.get(
    '/question-pools',
    requireTeacher,
    teachersController.getQuestionPool
);

// Profile
router.get('/profile', requireTeacher, teachersController.getEditProfile);
router.post(
    '/profile/update-profile-img',
    requireTeacher,
    profileUpload.single('img'),
    teachersController.postUpdateProfileImg
);
router.post(
    '/profile/update-profile',
    requireTeacher,
    teachersController.postUpdateProfile
);

router.post(
    '/profile/update-password',
    requireTeacher,
    teachersController.postUpdatePassword
);

// Auth

router.get('/login', teachersController.getLogin);
router.get('/register', teachersController.getRegister);
router.get('/dashboard', requireTeacher, teachersController.getDashboard);

router.post('/register', teachersController.postRegister);
router.post('/login', teachersController.postLogin);

module.exports = router;
