const Router = require('express')
const controller = require('../controllers/imageController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage }) // store them in memory as buffer
const router = new Router()

/**
 * get all the images
 */
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), controller.getAll)

/**
 * add an image for the item
 */
router.post(
    '/:item_id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    upload.single('image'),
    controller.setImageForItem,
)

/**
 * delete an image
 */
router.delete(
    '/:image-id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    controller.deleteImage,
)

module.exports = router
