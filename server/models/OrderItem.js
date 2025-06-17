const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const OrderItem = sequelize.define(
    'OrderItem',
    {
        order_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        item_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
    },
    {
        tableName: 'OrderItem',
        freezeTableName: true,
        paranoid: true,
    },
)

module.exports = OrderItem
