import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartScheme = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    products:[
        {
            id:{
                type:Schema.Types.ObjectId,
                refPath:'products.typeProduct',
            },
            typeProduct:{
                type:String,
                default:'product',
                enum:['product','accessory']
            },
            quantityCart: Number,
        }
    ],
    

}, {timestamps:true})

export default mongoose.model('cart', cartScheme)