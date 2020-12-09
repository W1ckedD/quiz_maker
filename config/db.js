const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    username: 'postgres',
    password: '123456',
    host: 'localhost',
    database: 'quiz_maker_node',
    logging: false,
});

// Models

const connectDB = async () => {
    try {
        const Admin = require('../models/Admin');
        const Teacher = require('../models/Teacher');
        const Student = require('../models/Student');
        const Course = require('../models/Course');
        const QuestionPool = require('../models/QuestionPool');
        const MultipleChoiceQuestion = require('../models/MultipleChoiceQuestion');
        const Option = require('../models/Option');
        const QuestionImage = require('../models/QuestionImage');
        const AnswearImage = require('../models/AnswearImage');

        const conn = await sequelize.sync({ force: true });
        console.log('Connected to Postgres');

        // Course - Student
        Course.belongsToMany(Student, { through: 'StudentCourse' });
        Student.belongsToMany(Course, { through: 'StudentCourse' });

        // Course - Teacher
        Teacher.hasMany(Course);
        Course.belongsTo(Teacher);

        // QuestionPool - Teacher
        Teacher.hasMany(QuestionPool);
        QuestionPool.belongsTo(Teacher);

        // QuestionPool - Question
        QuestionPool.hasMany(MultipleChoiceQuestion);
        MultipleChoiceQuestion.belongsTo(QuestionPool);

        // Question - QuestionImage
        MultipleChoiceQuestion.hasMany(QuestionImage);
        QuestionImage.belongsTo(MultipleChoiceQuestion);

        // Question - AnswearImage
        MultipleChoiceQuestion.hasMany(AnswearImage);
        AnswearImage.belongsTo(MultipleChoiceQuestion);

        // MultipleChoiceQuestion - Option
        MultipleChoiceQuestion.hasMany(Option);
        Option.belongsTo(MultipleChoiceQuestion);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = { connectDB, sequelize };
