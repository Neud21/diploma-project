const Router = require('express')
const roleMiddleware = require('../middlewares/roleMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const controller = require('../controllers/deliveryController')

const router = new Router()

router.get(
    '/all',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    controller.getListOfAllOrders,
)

router.get(
    '/available',
    authMiddleware,
    roleMiddleware(['COURIER']),
    controller.getListOfAvailableOrders,
)

router.get(
    '/take/:id',
    authMiddleware,
    roleMiddleware(['COURIER']),
    controller.takeOrder,
)

router.get(
    '/mark/delivered/:id',
    authMiddleware,
    roleMiddleware(['COURIER']),
    controller.markDelivered,
)

router.get(
    '/mark/failed/:id',
    authMiddleware,
    roleMiddleware(['COURIER']),
    controller.markFailed,
)

router.patch(
    '/mark/:orderId',
    authMiddleware,
    roleMiddleware(['USER', 'ADMIN', 'COURIER']),
    controller.markState,
)

module.exports = router
