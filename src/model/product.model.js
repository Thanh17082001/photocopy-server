import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    brandId:{
        type: Schema.Types.ObjectId,
        ref: 'brand'
    },
    name:{
        type:String
    },
    InputQuantity: {
        type: Number
    },
    soldQuantity: {
        type: Number
    },
    priceSale:{
        type: Number
    },
    priceRental:{
        type:Number
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    functionality:{
        type:String
    },
    status:{
        type:String,
        emum:['Cho Thuê', 'Đã bán', 'Sẵn có']
    },
    type:{
        type:String,
        emum:['Đã qua sử dụng', 'Mới']
    }
    
}, {timestamps:true})

export default mongoose.model('product', productSchema)