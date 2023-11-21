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
    phone:String,
    nameCustomer:String,
    address:String,
    email:String,
    products:[
        {
            productId: {
                type:Schema.Types.ObjectId,
                ref:'product',
            },
            nameProduct:String,
            priceRental:Number,
            priceImport:Number,
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
    priceMonth:Number,
    pricePayed:{
        type:Number,
        default:0
    },
    datePay:Date,
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
        type:String,
        default:'Chưa thanh toán',
        enum:['Chưa thanh toán','Thanh toán theo tháng','Đã thanh toán']
    },
    payInFull:{
        type:Boolean,
    },
    note:{
        type:String,
        default:''
    },
}, {timestamps:true})

export default mongoose.model('rental', rentalSchema)