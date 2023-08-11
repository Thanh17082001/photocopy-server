import mongoose  from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    products:[
        {
            productId: {
                type:Schema.Types.ObjectId,
                ref:'product'
            },
            quanlity:Number
        }
    ],
    nameCustomer:{
        type:String
    },
    phone:String,
    address:String
},{timestamps:true})

export default mongoose.model('order', orderSchema)
