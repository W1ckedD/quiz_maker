const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

module.exports = sequelize.define('QuizTemplate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});