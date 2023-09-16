import mongoose from "mongoose";
import { Schema } from "mongoose";

const entryReceipt = new Schema({
    createBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        require
    },
    products:[
        {
            idProduct:{
                type:Schema.Types.ObjectId,
                ref:'product'
            },
            inputQuantity:Number,
            priceImport:Number
        }
    ],
    totalAmount:Number,
    supplier:{
        type:Schema.Types.ObjectId,
        ref:'supplier'
    },
    image:String
}, {timestamps:true})

export default mongoose.model('entryReceipt',entryReceipt)