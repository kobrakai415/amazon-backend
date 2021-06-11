import express, { response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import models from '../helpers/sequelize.js'

const reviewsRouter = express.Router()

const Reviews = models.Reviews

reviewsRouter.get('/', async (req, res, next) => {
    try {
        const dbResponse = await Reviews.findAll()
        res.send(dbResponse);
    } catch (error) {
        res.status(500).send({ error })
    }
})

reviewsRouter.get('/:id', async (req, res, next) => {
    try {
        const dbResponse = await Reviews.findByPk(req.params.id)
        res.status(dbResponse ? 200 : 404).send(dbResponse ? dbResponse : { error: 'Author not found' })
    } catch (error) {
        res.status(500).send({ error })
    }
})

reviewsRouter.post('/', async (req, res, next) => {
    try {

        const dbResponse = await Reviews.create(req.body)
        res.send(dbResponse);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

reviewsRouter.put('/:id', async (req, res, next) => {
    try {

        const dbResponse = await Reviews.update(req.body, { where: { id: req.params.id }, returning: true })
        res.send(dbResponse)
    } catch (error) {
        res.status(500).send({ error })
    }
})

reviewsRouter.delete('/:id', async (req, res, next) => {
    try {
        const dbResponse = await Reviews.destroy({ where: { id: req.params.id } })
        if (dbResponse > 0) {
            res.send('Item deleted ');
        } else {
            res.status(400).send('Not found')
        }
    } catch (error) {
        res.status(500).send({ error })
    }
})

export default reviewsRouter

