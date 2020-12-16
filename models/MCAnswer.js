const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

module.exports = sequelize.define('MCAnswer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});