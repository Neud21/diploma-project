'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
        )

        await queryInterface.createTable('User', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true,
                allowNull: false,
            },
            login: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(60),
                allowNull: false,
            },
            role: {
                type: Sequelize.ENUM('USER', 'COURIER', 'ADMIN'),
                defaultValue: 'USER',
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('User')
        await queryInterface.dropTable('Users')
    },
}
