const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const USER_ROLE = ['ADMIN', 'USER', 'COURIER']

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        login: {
            type: DataTypes.STRING(30),
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...USER_ROLE),
            defaultValue: 'USER',
            allowNull: false,
        },
    },
    {
        tableName: 'User',
        freezeTableName: true,
        paranoid: true,
    },
)

module.exports = User
