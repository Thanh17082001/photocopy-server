import mongoose from "mongoose";
import { Schema } from "mongoose";

const entryReceipt = new Schema({
    createBy:{
        type:String,
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
    supplier:String
}, {timestamps:true})

export default mongoose.model('entryReceipt',entryReceipt)