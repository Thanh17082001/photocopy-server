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
    productId:[
        {
            type:Schema.Types.ObjectId,
            ref:'product'
        },
    ],
    startDate:Date,
    endDate:Date,
    totalAmount:Number,
    status:{
        type:String
    }
}, {timestamps:true})

export default mongoose.model('rental', rentalSchema)