const cloudinary = require("cloudinary").v2;
require("dotenv").config();

async function cloudinaryConfig() {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            
        })
        console.log("Cloudinary configuration successfull.");
    } catch (error) {
        console.log("Cloudinary configuration error.");
    }
    
}

module.exports = cloudinaryConfig;