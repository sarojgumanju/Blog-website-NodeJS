const express = require("express");
const app = express();
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const upload = multer({ 
    storage: multer.diskStorage({
        destination: "upload",
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    }),
});

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({
        message: "Connected successfully.",
    });
});

app.post("/imageUpload", upload.single("image"), (req, res) => {
    return res.status(200).json({
        message: "Image uploaded successfully.",
        file: req.file
    });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
