import mongoose  from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema({
    createBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        default:null
    },
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
            nameProduct:String,
            priceSale:Number,
            typeProduct:{
                type:String,
                default:'product',
                enum:['product','accessory']
            },
            quantity:Number,
        }
    ],
    totalCostOfProducts:Number,
    totalAmount:Number,
    IsOnlineOrder:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'Đang xử lý',
        enum:['Đang xử lý', 'Đang vận chuyển', 'Đã giao hàng','Hủy đơn']
    },
    paymentMethod:{
        type:String,
        default:'COD',
    },
    isPayment:{
        type:Boolean,
        default:false
    },
    note:{
        type:String,
        default:''
    },
    VAT:{
        type:Number,
        default:0
    },
    transportFee:{
        type:Number,
        default:0
    }
},{timestamps:true})

export default mongoose.model('order', orderSchema)
