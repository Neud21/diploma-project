const GetConfig = require('../config/index')
const jwt = require('jsonwebtoken')
const { Order, User, Item } = require('../models')
const orderPoolService = require('../services/orderPoolService')

class DeliveryController {
    async getListOfAllOrders(req, res) {
        try {
            const orders = await Order.findAll({
                include: [{ all: true }],
                order: [['createdAt', 'DESC']],
            })
            res.json(orders.map((order) => order.toJSON()))
        } catch (error) {
            console.error('Error fetching all orders:', error)
            res.status(500).json({
                message: 'Error fetching orders',
                error: error.message,
            })
        }
    }

    async getListOfAvailableOrders(req, res) {
        try {
            const availableOrders = orderPoolService.getAvailableOrders()
            res.json(availableOrders.map((order) => order.toJSON()))
        } catch (error) {
            console.error('Error fetching available orders:', error)
            res.status(500).json({
                message: 'Error fetching available orders',
                error: error.message,
            })
        }
    }

    async takeOrder(req, res) {
        try {
            const { id: orderId } = req.params
            //const courierId = req.user.id

            const token = req.headers.authorization?.split(' ')[1]

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const { SECRET } = GetConfig()
            const decoded = jwt.verify(token, SECRET)
            const courierId = decoded.id

            const result = await orderPoolService.takeOrder(orderId, courierId)

            if (result.success) {
                return res.json({
                    message: 'Order taken successfully',
                    orderId,
                })
            }

            res.status(409).json({
                message: 'Could not take order',
                error: result.error,
            })
        } catch (error) {
            console.error('Error taking order:', error)
            res.status(500).json({
                message: 'Error taking order',
                error: error.message,
            })
        }
    }

    async markDelivered(req, res) {
        try {
            const { id: orderId } = req.params
            const result = await orderPoolService.updateOrderState(
                orderId,
                'DELIVERED',
            )

            if (result.success) {
                return res.json({
                    message: 'Order marked as delivered',
                    orderId,
                })
            }

            res.status(400).json({
                message: 'Could not mark order as delivered',
                error: result.error,
            })
        } catch (error) {
            console.error('Error marking delivered:', error)
            res.status(500).json({
                message: 'Error updating order status',
                error: error.message,
            })
        }
    }

    async markFailed(req, res) {
        try {
            const { id: orderId } = req.params
            const result = await orderPoolService.updateOrderState(
                orderId,
                'REJECTED',
            )

            if (result.success) {
                return res.json({
                    message: 'Order marked as failed',
                    orderId,
                })
            }

            res.status(400).json({
                message: 'Could not mark order as failed',
                error: result.error,
            })
        } catch (error) {
            console.error('Error marking failed:', error)
            res.status(500).json({
                message: 'Error updating order status',
                error: error.message,
            })
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

module.exports = new DeliveryController()
