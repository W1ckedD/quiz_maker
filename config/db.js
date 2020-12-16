const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_CONN_STR, { logging: false });

// Models

const connectDB = async () => {
    try {
        const Admin = require('../models/Admin');
        const Answer = require('../models/Answer');
        const AnswerImage = require('../models/AnswerImage');
        const Course = require('../models/Course');
        const MCAnswer = require('../models/MCAnswer');
        const MCQuestion = require('../models/MCQuestion');
        const Option = require('../models/Option');
        const Question = require('../models/Question');
        const QuestionImage = require('../models/QuestionImage');
        const QuestionPool = require('../models/QuestionPool');
        const Quiz = require('../models/Quiz');
        const QuizTemplate = require('../models/QuizTemplate');
        const Student = require('../models/Student');
        const Teacher = require('../models/Teacher');

        // Teacher - Question pool
        Teacher.hasMany(QuestionPool);
        QuestionPool.belongsTo(Teacher);

        // Question pool - Question
        QuestionPool.hasMany(Question);
        Question.belongsTo(QuestionPool);

        // Question pool - MCQuestion
        QuestionPool.hasMany(MCQuestion);
        MCQuestion.belongsTo(QuestionPool);

        // Question - Qustion image
        Question.hasOne(QuestionImage);
        QuestionImage.belongsTo(Question);

        // MCQuestion - Option
        MCQuestion.hasMany(Option);
        Option.belongsTo(MCQuestion);

        // MCQuestion - Question image
        MCQuestion.hasOne(QuestionImage);
        QuestionImage.belongsTo(MCQuestion);

        // Teacher - Course
        Teacher.hasMany(Course);
        Course.belongsTo(Teacher);

        // Course - Quiz teamplate
        Course.hasMany(QuizTemplate);
        QuizTemplate.belongsTo(Course);

        // Quiz template - Question
        QuizTemplate.hasMany(Question);
        Question.belongsTo(QuizTemplate);

        // Quiz template - MCQuestion
        QuizTemplate.hasMany(MCQuestion);
        MCQuestion.belongsTo(QuizTemplate);

        // Course - Student
        Course.belongsToMany(Student, { through: 'CourseStudent' });
        Student.belongsToMany(Course, { through: 'CourseStudent' });

        // Student - Quiz
        Student.hasMany(Quiz);
        Quiz.belongsTo(Student);

        // Quiz - Answer
        Quiz.hasMany(Answer);
        Answer.belongsTo(Quiz);

        // Quiz - MCAnswer
        Quiz.hasMany(MCAnswer);
        MCAnswer.belongsTo(Quiz);

        // Answer - Answer image
        Answer.hasMany(AnswerImage);
        AnswerImage.belongsTo(AnswerImage);

        // Quiz - Quiz template
        QuizTemplate.hasMany(Quiz);
        Quiz.belongsTo(QuizTemplate);

        const conn = await sequelize.sync({ force: false, alter: false });
        console.log('Connected to Postgres');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = { connectDB, sequelize };
