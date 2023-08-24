import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name:String
}, {timestamps:true})

export default mongoose.model('category', categorySchema)