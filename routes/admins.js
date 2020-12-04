const express = require('express');
const adminsController = require('../controllers/admins');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.get('/login', adminsController.getLogin);
router.get('/register', adminsController.getRegister);
router.get('/dashboard', requireAdmin, adminsController.getDashboard);

router.post('/login', adminsController.postLogin);
router.post('/register', adminsController.postRegister);

module.exports = router;