import mongoose from "mongoose";
import { Schema } from "mongoose";

const rentalSchema = new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'customer'
    },
    createBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        default:null
    },
    products:[
        {
            productId: {
                type:Schema.Types.ObjectId,
                ref:'product',
            },
            nameProduct:String,
            priceRental:Number,
            quantity:Number,
        }
    ],
    IsOnlineOrder:{
        type:Boolean,
        default:false
    },
    totalCostOfProducts:Number,
    startDate:{
        type:Date,
        default: Date.now()
    },
    endDate:Date,
    quantityMonth:Number,
    totalAmount:Number,
    status:{
        type:String,
        default:'Đang xử lý',
        enum:['Đang xử lý', 'Đang vận chuyển', 'Đã giao hàng', 'Đang sử dụng','Dừng thuê','Hủy đơn']
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
    transportFee:{
        type:Number,
        default:0
    }
}, {timestamps:true})

export default mongoose.model('rental', rentalSchema)