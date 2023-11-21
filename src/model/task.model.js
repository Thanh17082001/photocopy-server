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
    wage:{
        type:Number,
        default:0
    },
    accessorys:[
        {
            accessoryId: {
                type:Schema.Types.ObjectId,
                ref:'accessory',
            },
            nameProduct:String,
            priceSale:Number,
            priceImport:Number,
            quantity:Number,
        }
    ],
    startDate:Date,
    endDate:Date,
    currentDate:Date,
    totalOfAccessory:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        default:0
    },
    nameCustomer:String,
    phone:String,
    address:String,
    email:String,
    status:{
        type:String,
        enum:['Hoàn thành', 'Đang tiến hành', 'Chưa bắt đầu', 'Đã báo cáo'],
        default:'Chưa bắt đầu'
    },
    allDay:{
        type:Boolean,
        default:false
    },
    note:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    isReport:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.model('task', taskSchema)