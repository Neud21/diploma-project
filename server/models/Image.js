const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Image = sequelize.define(
    'Image',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // description: {
        //     type: DataTypes.TEXT,
        // },
        // name: {
        //     type: DataTypes.STRING(30),
        //     unique: true,
        //     allowNull: false,
        // },
        meta: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
        },
        data: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'Image',
        modelName: 'Image',
        freezeTableName: true,
        paranoid: true,
    },
)

module.exports = Image
