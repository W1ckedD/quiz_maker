const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

module.exports = sequelize.define('MCQuestion', {
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
    answer: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});