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
    type:{
        type:String,
        emum:['Đã qua sử dụng', 'Mới']
    },
    
}, {timestamps:true})

export default mongoose.model('product', productSchema)