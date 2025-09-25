const express = require("express");
const {
  createBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  likeBlog,
  searchBlogs,
} = require("../controller/blogController");

const {
  addCommentBlog,
  deleteCommentBlog,
  updateCommentBlog,
  likeCommentBlog,
} = require("../controller/commentController");

const verifyUser = require("../middleware/auth");
const upload = require("../utils/multer");



const route = express.Router();
route.post("/", verifyUser, upload.single("image"), createBlog);
route.get("/", getBlogs);
route.get("/search-blogs", searchBlogs); // This should be at top of the getBlogById and other routes
route.get("/:blogId", getBlogById);
route.patch("/:id", verifyUser, upload.single("image"), updateBlog);
route.delete("/:id", verifyUser, deleteBlog);
route.post("/like/:id", verifyUser, likeBlog);
route.post("/comment/:id", verifyUser, addCommentBlog);
route.delete("/comment/:id", verifyUser, deleteCommentBlog);
route.patch("/edit-comment/:id", verifyUser, updateCommentBlog);
route.patch("/like-comment/:id", verifyUser, likeCommentBlog);
//route.delete("/", deleteAllUsers)
module.exports = route;
