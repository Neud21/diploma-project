// const Sequelize = require('sequelize')
const sequelize = require('../database')
const User = require('./User')
const Restaurant = require('./Restaurant')
const Item = require('./Item')
const Order = require('./Order')
const OrderItem = require('./OrderItem')
const Image = require('./Image')

function setupAssociations() {
    // Restaurant relationships
    Restaurant.hasMany(Item, {
        foreignKey: 'restaurant_id',
        onDelete: 'CASCADE',
        as: 'menu_item',
    })
    Item.belongsTo(Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'restaurant',
    })

    // Image relationships
    Item.hasMany(Image, {
        foreignKey: 'item_id',
        onDelete: 'CASCADE',
        as: 'image',
    })
    Image.belongsTo(Item, {
        foreignKey: 'item_id',
        as: 'item',
    })

    // User relationships
    User.hasMany(Order, {
        foreignKey: 'user_id',
        as: 'order',
        onDelete: 'CASCADE',
    })

    User.hasMany(Order, {
        foreignKey: 'courier_id',
        as: 'delivery',
        onDelete: 'SET NULL',
    })

    // Order relationships
    Order.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
    })

    Order.belongsTo(User, {
        foreignKey: 'courier_id',
        as: 'courier',
    })

    // Many-to-Many through OrderItem
    Order.belongsToMany(Item, {
        through: OrderItem,
        foreignKey: 'order_id',
        as: 'item',
        onDelete: 'CASCADE',
    })

    Item.belongsToMany(Order, {
        through: OrderItem,
        foreignKey: 'item_id',
        as: 'order',
        onDelete: 'CASCADE',
    })
}

// Set up associations after all models are initialized
setupAssociations()

module.exports = {
    sequelize,
    User,
    Restaurant,
    Item,
    Order,
    OrderItem,
}
