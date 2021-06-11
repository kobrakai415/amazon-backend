import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import models from '../helpers/sequelize.js'

const productsRouter = express.Router()
const Products = models.Products
const Reviews = models.Reviews
const Category = models.Category

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // grab cloudinaryURL feom process.env.Cludinary_URL
    params: {
        folder: 'Products',
    },
})

const upload = multer({ storage: cloudinaryStorage }).single('cover')


productsRouter.get('/', async (req, res, next) => {
    try {
        const dbResponse = await Products.findAll({
            include: [{ model: Category, attributes: ['name'] }]
            , attributes: { exclude: ['CategoryId'] }
        })
        res.send(dbResponse);
    } catch (error) {
        res.status(500).send({ error })
    }
})

productsRouter.get('/:id', async (req, res, next) => {
    try {
        const dbResponse = await Products.findByPk(req.params.id,
            {
                include: [{ model: Reviews, attributes: { exclude: ['updatedAt', 'createdAt'] } },
                { model: Category, as: 'category', attributes: ['name'] }]
                , attributes: { exclude: ['CategoryId'] }
            })
        res.status(dbResponse ? 200 : 404).send(dbResponse ? dbResponse : { error: 'Product not found' })
    } catch (error) {
        res.status(500).send({ error })
    }
})

productsRouter.post('/', async (req, res, next) => {
    console.log('I am here............')
    try {

        const dbResponse = await Products.create(req.body)

        res.send(dbResponse);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

productsRouter.put('/:id', async (req, res, next) => {
    try {
        const dbResponse = await Products.update(req.body, { where: { _id: req.params.id }, returning: true })
        res.send(dbResponse)
    } catch (error) {
        res.status(500).send({ error })
    }
})

productsRouter.delete('/:id', async (req, res, next) => {
    try {
        const dbResponse = await Products.destroy({ where: { _id: req.params.id } })
        if (dbResponse > 0) {
            res.send('Item deleted ');
        } else {
            res.status(400).send('Not found')
        }
    } catch (error) {
        res.status(500).send({ error })
    }
})

productsRouter.get('/:id/reviews', async (req, res, next) => {
    try {
        const dbResponse = await Reviews.findAll({ where: { 'productId': req.params.id } })
        res.send(dbResponse);
    } catch (error) {
        res.status(500).send({ error })
    }
})


productsRouter.post('/:id/reviews', async (req, res, next) => {
    try {

        const dbResponse = await Reviews.create(req.body)
        res.send(dbResponse);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

productsRouter.post('/:id/uploadCover', upload, async (req, res, next) => {
    try {
        const cover = req.file.path
        console.log(cover)
        const dbResponse = await Products.update({ 'imageUrl': cover }, { where: { _id: req.params.id } })
        if (dbResponse > 0) {
            res.send('ok')
        } else {
            res.status(400).send('Unable to add the avatar')
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
export default productsRouter