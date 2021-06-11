import express, { response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import models from '../helpers/sequelize.js'

const categoryRouter = express.Router()

const Category = models.Category


categoryRouter.get('/', async (req, res, next) => {
    try {
        const dbResponse = await Category.findAll()
        res.send(dbResponse);
    } catch (error) {
        res.status(500).send({ error })
    }
})

categoryRouter.get('/:id', async (req, res, next) => {
    try {
        const dbResponse = await Category.findByPk(req.params.id)
        res.status(dbResponse ? 200 : 404).send(dbResponse ? dbResponse : { error: 'Category not found' })
    } catch (error) {
        res.status(500).send({ error })
    }
})

categoryRouter.post('/', async (req, res, next) => {
    try {

        const dbResponse = await Category.create(req.body)
        res.send(dbResponse);
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
})

categoryRouter.put('/:id', async (req, res, next) => {
    try {

        const dbResponse = await Category.update(req.body, { where: { id: req.params.id }, returning: true })
        res.send(dbResponse)
    } catch (error) {
        res.status(500).send({ error })
    }
})

categoryRouter.delete('/:id', async (req, res, next) => {
    try {
        const dbResponse = await Category.destroy({ where: { id: req.params.id } })
        if (dbResponse > 0) {
            res.send('Item deleted ');
        } else {
            res.status(400).send('Not found')
        }
    } catch (error) {
        res.status(500).send({ error })
    }
})

export default categoryRouter

