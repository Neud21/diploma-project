const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const ORDER_STATES = [
    'PENDING',
    'PREPARING',
    'READY',
    'IN_DELIVERY',
    'DELIVERED',
    'CANCELED',
]

const Order = sequelize.define(
    'Order',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        state: {
            type: DataTypes.ENUM(...ORDER_STATES),
            defaultValue: 'PENDING',
            allowNull: false,
        },
        deliveryAddress: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    },
    {
        tableName: 'Order',
        freezeTableName: true,
        paranoid: true,
    },
)

module.exports = Order
