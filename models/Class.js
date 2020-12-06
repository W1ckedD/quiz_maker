const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    teacher: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    students: [mongoose.Types.ObjectId],
    quizes: [mongoose.Types.ObjectId],
});

module.exports = mongoose.model('Class', classSchema);