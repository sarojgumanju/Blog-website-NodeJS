const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


const cors = require("cors");
app.use(cors());
const connectDb = require("./config/dbConnect");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
const cloudinaryConfig = require("./config/cloudinaryConfig");

app.use(express.json());

// connect succesfully dekhauna ko lagi matra
app.get("/", (req, res) => {
  return res.status(200).json({message: "Connect Succesfully."})
})

// api version
app.use("/api/v1/users", userRoute);
app.use("/api/v1/blogs", blogRoute);

app.listen(5000, () => {
  console.log("server started.");
  connectDb();
  cloudinaryConfig();
});
