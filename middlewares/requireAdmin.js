const messages = require('../utils/messages');

module.exports = (req, res, next) => {
    if(!req.session.admin) {
        req.flash('error', messages.error401);
        return res.redirect('/admins/login');
    }
    next();
}