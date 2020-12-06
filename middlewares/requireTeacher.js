const messages = require('../utils/messages');

module.exports = (req, res, next) => {
    if(!req.session.teacher) {
        req.flash('error', messages.error401);
        return res.redirect('/teachers/login');
    }
    next();
}