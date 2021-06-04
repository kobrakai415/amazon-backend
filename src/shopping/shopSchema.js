import mongoose from 'mongoose'

const { Schema, model } = mongoose

const shopSchema = new Schema({
    product: String,
    quantity: {
        type: Number,
        default:1
    }
});



export default model("Cart", shopSchema)


// const CartSchema = new Schema(
// 	{
// 		ownerId: {type: Schema.Types.ObjectId, ref: "User"},
// 		products: [{asin: String, title: String, price: Number, quantity: Number}],
// 		status: {type: String, enum: ["active", "paid"]},
// 	},
// 	{timestamps: true}
// );