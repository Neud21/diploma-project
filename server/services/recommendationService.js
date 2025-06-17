const Item = require('../models/Item')
const { Sequelize, Op } = require('sequelize')
const { Restaurant } = require('../models')

class RecommendationService {
    CATEGORY_PRIORITY_MAP = {
        MAIN: ['SIDE', 'BEVERAGE', 'APPETIZER'],
        APPETIZER: ['MAIN', 'BEVERAGE', 'DESSERT'],
        BEVERAGE: ['APPETIZER', 'DESSERT', 'SIDE'],
        DESSERT: ['BEVERAGE', 'APPETIZER'],
        SIDE: ['BEVERAGE', 'DESSERT'],
    }

    async recommend(
        restaurant_id,
        excludeItemId,
        itemCategory,
        restaurantCategory,
        remainingBudget,
    ) {
        const priorityCategories =
            this.CATEGORY_PRIORITY_MAP[itemCategory] || []

        const items = await Item.findAll({
            where: {
                restaurant_id,
                id: {
                    [Op.ne]: excludeItemId,
                },
                category: priorityCategories,
            },
            order: [
                [
                    Sequelize.literal(`CASE "Item"."category"
                    ${priorityCategories.map((c, i) => `WHEN '${c}' THEN ${i}`).join(' ')}
                    ELSE ${priorityCategories.length}
                END`),
                    'ASC',
                ],
                ['price', 'ASC'],
            ],
            include: [
                {
                    model: Restaurant,
                    as: 'restaurant',
                    attributes: [],
                },
            ],
        })

        const recommendations = []
        let currentBudget = remainingBudget

        for (const category of priorityCategories) {
            const categoryItems = items
                .filter((i) => i.category === category)
                .sort((a, b) => a.price - b.price)

            const affordable = categoryItems.filter(
                (i) => i.price <= currentBudget,
            )

            if (affordable.length > 0) {
                const selected = affordable[0]
                recommendations.push(selected)
                currentBudget -= selected.price
            }

            if (currentBudget <= 0) break
        }

        return recommendations.map((i) => ({
            id: i.id,
            name: i.name,
            category: i.category,
            price: i.price,
            restaurantCategory,
        }))
    }
}

module.exports = new RecommendationService()
