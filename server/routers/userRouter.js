const Router = require('express')
const roleMiddleware = require('../middlewares/roleMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const userController = require('../controllers/userController')
const recommendationController = require('../controllers/recommendationsController')

const router = new Router()

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['USER', 'ADMIN']),
    userController.placeOrder,

)

router.patch(
    '/mark/:orderId',
    authMiddleware,
    roleMiddleware(['USER', 'ADMIN', 'COURIER']),
    userController.markState,
)

router.post(
    '/recommend-items',
    authMiddleware,
    roleMiddleware(['USER', 'ADMIN']),
    recommendationController.recommendByPriceAndItem,
)

module.exports = router
