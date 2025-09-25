const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: String,
    
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      }
    ]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema); // mongoose.model creates user table in database
module.exports = User;
