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
                refPath:'products.typeProduct',
            },
            typeProduct:{
                type:String,
                enum:['product', 'accessory'],
                default:'product'
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
    image: {
        data: Buffer,
        contentType: String
    },
}, {timestamps:true})

export default mongoose.model('entryReceipt',entryReceipt)