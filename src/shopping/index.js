import express from "express";
import shopModel from "./shopSchema.js";

const shoppingRouter = express.Router();

shoppingRouter.post("/cart/add", async (req, res, next) => {
	try {
		const shoppingcart = await shopModel(req.body);
		const check = await shopModel.findById(req.body._id);
		if (check) {
			await shopModel.findOneAndUpdate(
				{_id: req.body._id},
				{$inc: {quantity: 1}}
			);
			res.send("updated");
		} else {
			const item = await shoppingcart.save();
			console.log(item);
			res.send(item);
		}
	} catch (error) {
		console.log(error);
	}
});

shoppingRouter.post("/cart/remove", async (req, res, next) => {
	try {
		const check = await shopModel.findById(req.body._id);
		if (check && check.quantity > 1) {
			await shopModel.findOneAndUpdate(
				{_id: req.body._id},
				{$inc: {quantity: -1}},
				{new: true}
			);
			res.send("updated");
		} else if (check && check.quantity === 1) {
			await shopModel.findByIdAndDelete(req.body._id);
			res.send("product removed");
		}
	} catch (error) {
		console.log(error);
	}
});


shoppingRouter.get("/cart", async (req, res, next) => {
	try {
		const shoppingcart = await shopModel.find().populate();
		res.send(shoppingcart);
	} catch (error) {
		console.log(error);
	}
});

// commentRouter.post("/post/:id", async (req, res, next) => {
// 	try {
// 		const newComment = await commentModel(req.body);
// 		const comment = await newComment.save();
// 		await postModel.findByIdAndUpdate(req.params.id, {
// 			$push: {comments: comment._id},
// 		});
// 		res.send(comment);
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

export default shoppingRouter;

// CartSchema.static("incrementCartQuantity", async function (id, asin, quantity) {
// 	await this.findOneAndUpdate(
// 		{
// 			ownerId: mongoose.Types.ObjectId(id),
// 			status: "active",
// 			"products.asin": asin,
// 		},
// 		{$inc: {"products.$.quantity": quantity}},
// 		{upsert: true}
// 	);
// });

// CartSchema.static("addBookToCart", async function (id, book) {
// 	await this.findOneAndUpdate(
// 		{ownerId: mongoose.Types.ObjectId(id), status: "active"},
// 		{
// 			$addToSet: {products: book},
// 		},
// 		{upsert: true}
// 	);
// });
