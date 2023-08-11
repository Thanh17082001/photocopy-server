import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";

const cartScheme = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    products:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:'product'
            },
            quantity: Number,
        }
    ],
    

}, {timestamps:true})

export default mongoose.model('cart', cartScheme)