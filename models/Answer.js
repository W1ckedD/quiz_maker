const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

module.exports = sequelize.define('Answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});