'use strict'

const ORDER_STATES = [
    'PENDING',
    'PREPARING',
    'READY',
    'IN_DELIVERY',
    'DELIVERED',
    'CANCELED',
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Order', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true,
                allowNull: false,
            },
            courier_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'User',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            deliveryAddress: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            state: {
                type: Sequelize.ENUM(...ORDER_STATES),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        })

        await queryInterface.addIndex('Order', ['user_id'])
        await queryInterface.addIndex('Order', ['courier_id'])
        await queryInterface.addIndex('Order', ['state'])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('OrderItem')
        await queryInterface.dropTable('Order')
    },
}
