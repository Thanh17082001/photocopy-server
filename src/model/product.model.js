import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    brandId:{
        type: Schema.Types.ObjectId,
        ref: 'brand'
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'category'
    },
    typeId:{
        type:Schema.Types.ObjectId,
        ref:'type'
    },
    name:{
        type:String
    },
    inputQuantity: {
        type: Number,
        default:0
    },
    soldQuantity: {
        type: Number,
        default:0
    },
    rentalQuantity: {
        type: Number,
        default:0
    },
    priceSale:{
        type: Number
    },
    priceImport:{
        type: Number,
        default:0
    },
    priceRental:{
        type:Number
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    dateEntyReceipt:Date,
    warrantyTime:Number
}, {timestamps:true})

export default mongoose.model('product', productSchema)