const Router = require('express')
const roleMiddleware = require('../middlewares/roleMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const controller = require('../controllers/restaurantController')

const multer = require('multer')
const path = require('path')
const { fileURLToPath } = require('url')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({
    storage: storage,
})

const router = new Router()

router.post(
    '/create',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    controller.createRestaurant,
)
router.post(
    '/create/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    upload.single('image'),
    controller.createItem,
)
router.get(
    '/get',
    authMiddleware,
    roleMiddleware(['USER', 'ADMIN']),
    controller.get,
)
router.get(
    '/:id',
    authMiddleware,
    roleMiddleware(['USER', 'ADMIN']),
    controller.getItems,
)
router.delete(
    '/delete/item/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    controller.deleteItem,
)
router.delete(
    '/delete/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    controller.deleteRestaurant,
)

module.exports = router
