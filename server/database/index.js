const { Sequelize } = require('sequelize')
// const GetConfig = require('../config/index')
require('dotenv').config()

// Get the required config
// const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = GetConfig()

// Creating connection to database
const sequelize = new Sequelize(
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`,
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: false,
        },
        define: {
            paranoid: true,
            underscored: false,
        },
        logging: false,
    },
)

module.exports = sequelize
