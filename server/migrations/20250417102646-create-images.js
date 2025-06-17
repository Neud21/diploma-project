'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Image', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true,
                allowNull: false,
            },
            // name: {
            //     type: Sequelize.STRING(30),
            //     allowNull: false,
            //     unique: true,
            // },
            // description: {
            //     type: Sequelize.TEXT,
            // },
            meta: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: {},
            },
            data: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
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
        await queryInterface.dropTable('Image')
    },
}
