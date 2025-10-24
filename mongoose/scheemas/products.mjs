import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: String,

    price: {
        type: Number,
        required: true
    },

    images: [String], //i will use Cloudinary or uploads folder later

    stock: { 
        type: Number, 
        default: 0 
    },

    category: String,
    
    color: {
        type: String,
    },
    
    createdAt: { type: Date, default: Date.now }




});

export const Product = mongoose.model("Product", ProductSchema);