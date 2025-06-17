const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const ITEM_CATEGORIES = ['MAIN', 'APPETIZER', 'DESSERT', 'BEVERAGE', 'SIDE']

const Item = sequelize.define(
    'Item',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(30),
            unique: true,
            allowNull: false,
        },
        description: DataTypes.TEXT,
        fats: DataTypes.INTEGER,
        proteins: DataTypes.INTEGER,
        carbohydrates: DataTypes.INTEGER,
        calories: DataTypes.INTEGER,
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM(...ITEM_CATEGORIES),
            allowNull: false,
        },
    },
    {
        tableName: 'Item',
        freezeTableName: true,
        paranoid: true,
    },
)

module.exports = Item
