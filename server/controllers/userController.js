const jwt = require('jsonwebtoken')
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const Item = require('../models/Item')
const User = require('../models/User')
const GetConfig = require('../config/index')
const orderPoolService = require('../services/orderPoolService')

class UserController {
    async placeOrder(req, res) {
        try {
            const { deliveryAddress, items } = req.body
            const token = req.headers.authorization?.split(' ')[1]

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const { SECRET } = GetConfig()
            const decoded = jwt.verify(token, SECRET)
            const userId = decoded.id

            // Проверяем существование пользователя
            const user = await User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Валидация
            if (!deliveryAddress || !items?.length) {
                return res
                    .status(400)
                    .json({ message: 'Missing required fields' })
            }
            // const { deliveryAddress, items } = req.body
            //
            // const token = req.headers.authorization.split(' ')[1]
            //
            // const { SECRET } = GetConfig()
            //
            // const user = jwt.verify(token, SECRET)
            //
            // const { id } = user

            // // Проверка существования товаров
            // const itemIds = items.map(item => item.id);
            // const existingItems = await Item.findAll({ where: { id: itemIds } });
            //
            // if (existingItems.length !== items.length) {
            //     return res.status(404).json({ message: 'Some items not found' });
            // }

            // Создание заказа
            const newOrder = await Order.create({
                state: 'PENDING',
                deliveryAddress,
                user_id: userId,
            })

            // Связь товаров с заказом
            await OrderItem.bulkCreate(
                items.map((item) => ({
                    order_id: newOrder.id,
                    item_id: item.id,
                })),
            )

            // Получение полной информации
            const fullOrder = await Order.findByPk(newOrder.id, {
                include: [
                    {
                        model: Item,
                        as: 'item',
                        through: { attributes: [] },
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'login', 'role'],
                    },
                ],
            })

            await orderPoolService.addOrderToPool(newOrder.id)

            return res.status(201).json({
                message: 'Order created successfully',
                order: fullOrder,
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: 'internal server error' })
        }
    }

    async markState(req, res) {
        try {
            const { orderId } = req.params
            const { state } = req.body
            const token = req.headers.authorization?.split(' ')[1]

            if (!orderId || !state) {
                return res.status(400).json({
                    message: 'Order ID and state are required',
                })
            }

            const { SECRET } = GetConfig()
            const decoded = jwt.verify(token, SECRET)
            const userId = decoded.id

            const order = await Order.findByPk(orderId, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id'],
                    },
                ],
            })

            if (!order) {
                return res.status(404).json({ message: 'Order not found' })
            }

            const allowedStates = ['CANCELED', 'DELIVERED', 'PENDING']
            if (!allowedStates.includes(state)) {
                return res.status(400).json({
                    message: `Invalid state. Allowed values: ${allowedStates.join(', ')}`,
                })
            }

            const [affectedRows] = await Order.update(
                { state },
                {
                    where: { id: orderId },
                    individualHooks: true,
                },
            )

            if (affectedRows === 0) {
                return res.status(409).json({
                    message: 'Order state was not updated',
                })
            }

            orderPoolService.nc.publish(
                'order.stateChanged',
                JSON.stringify({
                    orderId,
                    newState: state,
                    userId,
                    timestamp: new Date().toISOString(),
                }),
            )

            const updatedOrder = await Order.findByPk(orderId, {
                include: [
                    {
                        model: Item,
                        as: 'item',
                        through: { attributes: [] },
                    },
                ],
            })

            orderPoolService.updatePoolState(orderId, state)

            return res.json({
                message: 'Order state updated successfully',
                order: updatedOrder,
            })
        } catch (e) {
            console.error('State update error:', e)

            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Invalid token' })
            }

            if (e.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: e.errors.map((err) => err.message),
                })
            }

            return res.status(500).json({
                message: 'Internal server error',
                details:
                    process.env.NODE_ENV === 'development'
                        ? e.message
                        : undefined,
            })
        }
    }
}

module.exports = new UserController()
