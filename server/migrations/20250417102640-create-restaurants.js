'use strict'

const RESTAURANT_CATEGORY = [
    'ASIAN',
    'ITALIAN',
    'RUSSIAN',
    'GREEK',
    'BELARUSIAN',
    'HUNGERIAN',
    'AMERICAN',
    'ANGOLAN',
    'ARAB',
    'ARGENTINE',
    'AUSTRALIAN',
    'GERMAN',
    'AUSTRIAN',
    'BELGIAN',
    'BOSNIAN',
    'BRAZILIAN',
    'CAMBODIAN',
    'CANADIAN',
    'CHILEAN',
    'CHINESE',
    'JAPANESE',
    'COLOMBIAN',
    'CONGOLESE',
    'CROATIAN',
    'CZECH',
    'DUTCH',
    'EGYPTIAN',
    'ETHIOPIAN',
    'FILIPINO',
    'FINNISH',
    'FRENCH',
    'INDIAN',
    'INDONESIAN',
    'IRISH',
    'ISRAELI',
    'JAMAICAN',
    'KAZAKH',
    'KENYAN',
    'KOREAN',
    'MALAGASY',
    'MALAYSIAN',
    'MEXICAN',
    'MONGOLIAN',
    'NIGERIAN',
    'NORWEGIAN',
    'PACIFIC',
    'PAKISTANI',
    'PERUVIAN',
    'POLISH',
    'PORTUGUESE',
    'MISC',
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Restaurant', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },
            category: {
                type: Sequelize.ENUM(...RESTAURANT_CATEGORY),
                allowNull: false,
            },
            delivery: {
                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('Restaurant')
    },
}
