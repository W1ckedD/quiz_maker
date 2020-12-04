const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        default: '/img/profile.png',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    quizes: [mongoose.Types.ObjectId],
    classes: [mongoose.Types.ObjectId],
});

module.exports = mongoose.model('Teacher', teacherSchema);