import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
    serviceId:{
        type:Schema.Types.ObjectId,
        ref:'service',
        default:null
    },
    staffId:{
        type:Schema.Types.ObjectId,
        ref:'staff',
        default:null
    },
    startDate:Date,
    endDate:Date,
    currentDate:Date,
    totalAmount:{
        type:Number,
        default:0
    },
    nameCustomer:String,
    phone:String,
    address:String,
    status:{
        type:String,
        enum:['Hoàn thành', 'Đang tiến hành', 'Chưa bắt đầu', 'Quá hạn'],
        default:'Chưa bắt đầu'
    }
},{timestamps:true})

export default mongoose.model('task', taskSchema)