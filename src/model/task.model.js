import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
    serviceId:{
        type:Schema.Types.ObjectId,
        ref:'service'
    },
    staffId:{
        type:Schema.Types.ObjectId,
        ref:'staff'
    },
    startDate:Date,
    dealine:Date,
    description:String,
    totalAmount:Number,
    status:{
        type:String,
        enum:['Hoàn thành', 'Đang tiến hành','Trễ hạn']
    }
},{timestamps:true})

export default mongoose.model('task', taskSchema)