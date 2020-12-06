const messages = require('../utils/messages');

module.exports = (req, res, next) => {
    if(!req.session.student) {
        req.flash('error', messages.error401);
        return res.redirect('/students/login');
    }
    next();
}