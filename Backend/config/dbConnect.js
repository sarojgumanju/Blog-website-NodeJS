const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Db connnected succesfully.");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDb;