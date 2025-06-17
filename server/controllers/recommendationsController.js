const Item = require('../models/Item')
const Image = require('../models/Image')
const { Restaurant } = require('../models')
const RecommendationService = require('../services/recommendationService')

class recommendationsController {
    async recommendByPriceAndItem(req, res) {
        try {
            const { itemId, totalPrice } = req.body

            if (!itemId || !totalPrice) {
                return res.status(400).json({
                    message: 'Required fields are missing',
                })
            }

            // 1. Исправляем псевдоним ассоциации на 'images' (множественное число)
            const mainItem = await Item.findByPk(itemId, {
                include: [
                    {
                        model: Restaurant,
                        as: 'restaurant',
                        attributes: ['id', 'category'],
                    },
                    {
                        model: Image,
                        as: 'image', // Исправлено на множественное число
                        attributes: ['id', 'meta', 'data'],
                    },
                ],
            })

            if (!mainItem) {
                return res.status(404).json({
                    message: 'Item not found',
                })
            }

            if (mainItem.price > totalPrice) {
                return res.status(400).json({
                    message: 'Main item exceeds target price',
                    recommendations: [],
                })
            }

            // 2. Убедимся, что сервис рекомендаций возвращает изображения
            const recommendations = await RecommendationService.recommend(
                mainItem.restaurant.id,
                mainItem.id,
                mainItem.category,
                mainItem.restaurant.category,
                totalPrice - mainItem.price,
            )

            // 3. Форматируем ответ корректно
            const response = {
                mainItem: {
                    id: mainItem.id,
                    name: mainItem.name,
                    price: mainItem.price,
                    images: mainItem.image.map(img => ({
                        id: img.id,
                        name: img.meta.name || 'Unnamed image',
                        imageUrl: img.data,
                    }))
                },
                recommendations: [],
                totalPrice: mainItem.price
            }

            // 4. Обрабатываем рекомендации с изображениями
            for (const item of recommendations) {
                const fullItem = await Item.findByPk(item.id, {
                    include: [{
                        model: Image,
                        as: 'image',
                        attributes: ['id', 'meta', 'data']
                    }]
                })

                response.recommendations.push({
                    id: fullItem.id,
                    name: fullItem.name,
                    price: fullItem.price,
                    images: fullItem.image.map(img => ({
                        id: img.id,
                        name: img.meta.name || 'Unnamed image',
                        imageUrl: img.data,
                    }))
                })

                response.totalPrice += fullItem.price
            }

            res.json(response)

        } catch (e) {
            console.error('Recommendation error:', e)
            res.status(500).json({
                message: 'Error during recommendation evaluation',
                error: process.env.NODE_ENV === 'development' ? e.message : null
            })
        }
    }
}

module.exports = new recommendationsController()
