const Item = require('../models/Item')
const Image = require('../models/Image')

class ImageController {
    async getAll(req, res) {
        try {
            const images = await Image.findAll()

            res.json(
                images.map((image) =>
                    image.get({
                        plain: true,
                    }),
                ),
            )
        } catch (e) {
            console.error(e)
            res.status(500).json({
                message: 'Error trying to get all the images',
            })
        }
    }

    async setImageForItem(req, res) {
        try {
            const { id } = req.params

            const item = await Item.findByPk(id)

            if (!item) {
                res.status(400).json({ message: 'cannot find such item' })
            }

            const { buffer, originalName, mimeType } = req.file

            const { name, description } = req.body

            const newImage = await Image.create({
                meta: {
                    name: name || originalName,
                    description: description,
                    type: mimeType,
                },
                data: buffer,
                item_id: id,
            })

            return res.status(200).json({
                message: `image "${name}" set successfully`,
                item: {
                    id: item.id,
                    name: item.name,
                },
                image: {
                    id: newImage.id,
                    description: newImage.description,
                    name: newImage.name,
                    meta: newImage.meta,
                    data: newImage.data,
                },
            })
        } catch (e) {
            console.error(e)
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    async deleteImage(req, res) {
        try {
            const { id } = req.params

            const image = await Image.findByPk(id)

            if (!image) {
                return res
                    .status(400)
                    .json({ message: 'cannot find such image' })
            }

            await image.destroy()

            return res.status(200).json({
                message: `Image "${image.name}" by id ${image.id}
                 successfully deleted`,
                image: image,
            })
        } catch (e) {
            console.error('Error deleting image', e)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}

module.exports = new ImageController()
