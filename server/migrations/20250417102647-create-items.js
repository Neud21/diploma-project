'use strict'

const ITEM_CATEGORIES = ['MAIN', 'APPETIZER', 'DESSERT', 'BEVERAGE', 'SIDE']

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Item', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true,
                allowNull: false,
            },
            restaurant_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Restaurant',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            description: Sequelize.TEXT,
            fats: Sequelize.INTEGER,
            proteins: Sequelize.INTEGER,
            carbohydrates: Sequelize.INTEGER,
            calories: Sequelize.INTEGER,
            category: {
                type: Sequelize.ENUM(...ITEM_CATEGORIES),
                // allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                // allowNull: false,
            },
            image_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Image',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        })

        await queryInterface.addIndex('Item', ['restaurant_id'])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('Image', 'Image_item_id_fkey')
        await queryInterface.dropTable('Item')
    },
}
