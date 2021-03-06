import express from "express"
import createError from "http-errors"
import ReviewModel from "./schema.js"
import ProductModel from "../products/schema.js"
import q2m from "query-to-mongo"

const reviewRouter = express.Router()

reviewRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        console.log(query)
        const total = await ReviewModel.countDocuments(query.criteria)
        const limit = 25
        const result = await ReviewModel.find(query.criteria)
            .sort(query.options.sort)
            .skip(query.options.skip || 0)
            .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)
        res.status(200).send({ links: query.links("/products", total), total, result })
    } catch (error) {
        next(error)
    }
})

reviewRouter.get("/:id", async (req, res, next) => {
    try {
        const result = await ReviewModel.findById(req.params.id)
        if (!result) createError(400, "id not found")
        else res.status(200).send(result)
    } catch (error) {
        next(error)
    }
})

reviewRouter.post("/:id", async (req, res, next) => {
    try {
        const entry = { ...req.body, productID: req.params.id }
        const review = new ReviewModel(entry)
        const { _id } = await review.save()

        await ProductModel.findByIdAndUpdate(req.params.id, { $push: { reviews: _id } })

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

reviewRouter.put("/:id", async (req, res, next) => {
    try {
        const result = await ReviewModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { runValidators: true, new: true, useFindAndModify: false }
        )
        if (result) res.status(200).send(result)
        else createError(400, "ID not found")
    } catch (error) {
        next(error)
    }
})

reviewRouter.delete("/:id", async (req, res, next) => {
    try {
        const result = await ReviewModel.findByIdAndRemove(req.params.id, { useFindAndModify: false })
        const { productId } = result
        await ProductModel.findOneAndUpdate(
            { _id: productId },
            { $pull: { reviews: req.params.id } },
            { new: true, useFindAndModify: false }
        )

        if (result) res.status(200).send("Deleted")
        else createError(400, "ID not found")
    } catch (error) {
        next(error)
    }
})

export default reviewRouter
