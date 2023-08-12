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
    totalAmount:Number,
    nameCustomer:{
        type:String
    },
    status:{
        type:String,
        enum:['Đang xử lý', 'Đang vận chuyển', 'Đã giao hàng']
    },
    phoneNumber:String,
    address:String
},{timestamps:true})

export default mongoose.model('order', orderSchema)
