'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderItem', {
            order_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: 'Order',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            item_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: 'Item',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('OrderItem')
    },
}
