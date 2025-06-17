const Restaurant = require('../models/Restaurant')
const Item = require('../models/Item')
const Image = require('../models/Image')

class restaurantController {
    async createRestaurant(req, res) {
        try {
            const { name, category, delivery } = req.body

            if (!name || !category) {
                return res
                    .status(400)
                    .json({ message: 'All fields are required.' })
            }

            const restaurant = await Restaurant.create({
                name: name,
                category: category,
                delivery: delivery,
            })

            return res.status(201).json({
                message: 'Restaurant created successfully.',
                restaurant: restaurant,
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: 'Restaurant creation error.' })
        }
    }

    async get(req, res) {
        try {
            const restaurants = await Restaurant.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            })
            return res.status(200).json({
                message: 'Get all restaurants successfully working.',
                restaurants: restaurants,
            })
        } catch (e) {
            console.error('Error fetching restaurants:', e)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    async createItem(req, res) {
        try {
            const { id } = req.params
            const restaurant = await Restaurant.findByPk(id)

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' })
            }

            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: 'Image file is required' })
            }

            const { filename, originalname, mimetype } = req.file

            const imageUrl = `/uploads/${filename}`

            const newItem = await Item.create({
                ...req.body,
                restaurant_id: id,
            })

            const newImage = await Image.create({
                meta: {
                    name: originalname,
                    description: '',
                    type: mimetype,
                },
                item_id: newItem.id,
                data: imageUrl,
            })

            return res.status(201).json({
                message: `Dish "${req.body.name}" created successfully`,
                item: {
                    id: newItem.id,
                    name: newItem.name,
                    imageUrl: imageUrl,
                    meta: {
                        imageType: mimetype,
                    },
                },
            })
        } catch (e) {
            console.error('Error creating item:', e)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    async getItems(req, res) {
        try {
            const { id } = req.params

            const restaurant = await Restaurant.findByPk(id)
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' })
            }

            const items = await Item.findAll({
                where: { restaurant_id: id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'restaurant_id'],
                },
                include: [
                    {
                        model: Image,
                        as: 'image',
                        attributes: ['id', 'meta', 'data'],
                    },
                ],
            })

            return res.status(200).json({
                message: `Menu for restaurant ${restaurant.name} retrieved successfully`,
                restaurant: {
                    id: restaurant.id,
                    name: restaurant.name,
                    category: restaurant.category,
                },
                items,
            })
        } catch (e) {
            console.error('Error fetching restaurant menu:', e)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    async deleteItem(req, res) {
        try {
            const { id } = req.params
            const foundItem = await Item.findByPk(id)

            if (!foundItem) {
                return res.status(404).json({ message: 'Item not found' })
            }

            await foundItem.destroy() // soft-delete

            return res.status(200).json({
                message: `Dish "${foundItem.name}" deleted successfully.`,
                item: foundItem,
            })
        } catch (e) {
            console.error('Error deleting item:', e)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    async deleteRestaurant(req, res) {
        try {
            const { id } = req.params
            const foundRestaurant = await Restaurant.findByPk(id)

            if (!foundRestaurant) {
                return res.status(404).json({ message: 'Restaurant not found' })
            }

            await foundRestaurant.destroy() // soft-deletion

            return res.status(200).json({
                message: `Restaurant ${foundRestaurant.name} deleted successfully.`,
                restaurant: foundRestaurant,
            })
        } catch (e) {
            console.error('Error deleting item:', e)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}

module.exports = new restaurantController()
