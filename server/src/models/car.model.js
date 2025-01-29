import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const carSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Array of image URLs/paths
        validate: [arrayLimit, 'Exceeds the limit of 10 images']
    },
    tags: {
        type: [String], // Array of tags
        default: [],
        set: tags => tags.map(tag => tag.trim().toLowerCase()) // Normalize tags
    },
},{timestamps:true});

carSchema.plugin(mongooseAggregatePaginate);

// Custom validator for image array length
function arrayLimit(val) {
    return val.length <= 10;
}

export const Car = mongoose.model('Car', carSchema);