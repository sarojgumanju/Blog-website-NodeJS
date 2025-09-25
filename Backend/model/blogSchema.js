const mongoose = require("mongoose");
const BlogShcema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    }, 

    draft: {
      type: Boolean,
      default: false
    },

    blogId: {
      type: String,
      required: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, 
    
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId, // mongoDB ko object id
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId, // mongoDB ko object id
        ref: "Comment",
      },
    ],

    image: {
      type: String, 
      required: true,
    },
    
    imageId: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", BlogShcema); // creates table name Blog in mongodb
module.exports = Blog;