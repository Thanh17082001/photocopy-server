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
        ref:'customer',
        default:null
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:'product'
    },
    phone:String,
    nameCustomer:String,
    address:String,
    accessorys:[
        {
            accessoryId: {
                type:Schema.Types.ObjectId,
                ref:'accessory',
            },
            nameProduct:String,
            priceSale:Number,
            quantity:Number,
        }
    ],
    totalAmount:Number,
    pricePayed:{
        type:Number,
        default:0
    },
    warrantyExpires:{ // hết hạn bảo hành
        type:Boolean,
        default:false
    },
    Datedealine:Date,
    status:{
        type:String,
        default:'Đang xử lý',
        enum:['Đang xử lý', 'Hoàn thành']
    },
    paymentMethod:{
        type:String,
        default:null,
    },
    isPayment:{
        type:Boolean,
        default:null
    },
    note:{
        type:String,
        default:''
    },
},{timestamps:true})

export default mongoose.model('warranty', orderSchema)
