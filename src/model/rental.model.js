import mongoose from "mongoose";
import { Schema } from "mongoose";

const rentalSchema = new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'customer'
    },
    staffId:{
        type:Schema.Types.ObjectId,
        ref:'staff'
    },
    products:[
       {
        productId:{
            type:Schema.Types.ObjectId,
            ref:'product'
        },
        duration:Number
       }
    ],
    startDate:Date,
    endDate:Date,
    totalAmount:Number,
    status:{
        type:String,
        enum:['Đang thỏa thuận', 'Đã ký'] // đang hoat dong, dang cho xu ly
    }
}, {timestamps:true})

export default mongoose.model('rental', rentalSchema)