import mongoose from "mongoose";
import { Schema } from "mongoose";

const imageSchema = new Schema(
    {
        filename: String,
        image:{
            data:Buffer,
            contentType: String
        }
    },
    { timestamps: true },
);

export default mongoose.model('iamge',imageSchema)