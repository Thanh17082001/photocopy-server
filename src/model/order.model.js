import mongoose  from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'customer'
    },
    products:[
        {
            productId: {
                type:Schema.Types.ObjectId,
                refPath:'products.typeProduct',
            },
            typeProduct:{
                type:String,
                default:'product',
                enum:['product','accessory']
            },
            quanlity:Number
        }
    ],
    totalAmount:Number,
    IsOnlineOrder:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['Đang xử lý', 'Đang vận chuyển', 'Đã giao hàng']
    },
    PaymentMethod:String,
    isPayment:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.model('order', orderSchema)
