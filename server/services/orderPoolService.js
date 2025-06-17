const nats = require('nats')
const { Order, Item } = require('../models')
// const { OrderItem } = require('../models')

const jc = nats.JSONCodec()
const sc = nats.StringCodec()

class OrderPoolService {
    constructor() {
        this.pool = new Map()
        this.nc = null
        this.initialize().then((r) => r)
    }

    async initialize() {
        this.nc = await nats.connect({
            servers: 'nats://nats:4222', // if error, try nats://nats:8222
            timeout: 5000,
            waitOnFirstConnect: true,
        })

        const orders = await Order.findAll({
            where: { state: 'PENDING' },
            include: [
                {
                    model: Item,
                    as: 'item',
                    through: { attributes: [] }, // Exclude join table attributes
                },
            ],
        })

        orders.forEach((order) => this.pool.set(order.id, order))

        this.setupSubscriptions()
    }

    setupSubscriptions() {
        this.nc.subscribe('order.created', {
            callback: async (err, msg) => {
                const orderId = sc.decode(msg.data)
                await this.addOrderToPool(orderId)
            },
        })

        this.nc.subscribe('order.updated', {
            callback: (err, msg) => {
                const { id, state } = jc.decode(msg.data)
                this.updatePoolState(id, state)
            },
        })
    }

    async addOrderToPool(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: Item,
                    as: 'item',
                    through: { attributes: [] },
                },
            ],
        })

        if (order?.state === 'PENDING') {
            this.pool.set(order.id, order)
            this.nc.publish('order.available', jc.encode(order))
        }
    }

    updatePoolState(orderId, newState) {
        if (newState !== 'PENDING') {
            this.pool.delete(orderId)
        }
    }

    async takeOrder(orderId, courierId) {
        const order = this.pool.get(orderId)

        if (!order || order.state !== 'PENDING') {
            return { success: false, error: 'Order not available' }
        }

        try {
            const [affected] = await Order.update(
                {
                    state: 'IN_DELIVERY',
                    courier_id: courierId,
                },
                {
                    where: {
                        id: orderId,
                        state: 'PENDING',
                    },
                },
            )

            if (affected > 0) {
                this.pool.delete(orderId)
                this.nc.publish(
                    'order.taken',
                    jc.encode({
                        orderId,
                        courierId,
                        timestamp: new Date().toISOString(),
                    }),
                )
                return { success: true }
            }

            return { success: false, error: 'Concurrent modification' }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    getAvailableOrders() {
        return Array.from(this.pool.values())
    }

    async updateOrderState(orderId, newState) {
        try {
            const validTransitions = {
                TAKEN: ['IN_DELIVERY'],
                IN_DELIVERY: ['DELIVERED', 'REJECTED'],
            }

            const order = await Order.findByPk(orderId)

            if (!validTransitions[order.state]?.includes(newState)) {
                throw new Error(
                    `Invalid state transition: ${order.state} → ${newState}`,
                )
            }

            await order.update({ state: newState })
            this.nc.publish(
                'order.updated',
                jc.encode({
                    orderId,
                    newState,
                }),
            )

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}

module.exports = new OrderPoolService()
