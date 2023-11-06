import mongoose from "mongoose";
import { Schema } from "mongoose";

const accessorySchema = new Schema({
    brandId:{
        type:Schema.Types.ObjectId,
        ref:'brand',
    },
    typeId:{
        type:Schema.Types.ObjectId,
        ref:'type-accessory',
    },
    name:String,
    image:String,
    inputQuantity: {
        type: Number,
        default:0
    },
    soldQuantity: {
        type: Number,
        default:0
    },
    priceSale:{
        type: Number,
    },
    priceImport:{
        type: Number,
        default:0
    },
    description:{
        type:String
    },
    fits:[
        {
            product:{
                type:Schema.Types.ObjectId,
                ref:'product'
            }
        }
    ],
    dateEntyReceipt:Date
}, {timestamps:true})
export default mongoose.model('accessory', accessorySchema)