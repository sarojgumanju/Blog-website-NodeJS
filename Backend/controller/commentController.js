const Blog = require("../model/blogSchema");
const Comment = require("../model/commentSchema");


// -------------------------------add comment --------------------------------------
async function addCommentBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter the comment." });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    }

    const createComment = await Comment.create({
      comment,
      blog: id,
      user: creator,
    });

    const populatedComment = await createComment.populate("user", "name email");

    const cmt = await Blog.findByIdAndUpdate(id, {
      $push: { comments: createComment._id },
    });

    return res
      .status(201)
      .json({ success: true, message: "Comment added successfully.", createComment: populatedComment });
  } catch (error) {
    return res.status(201).json({ success: false, message: "Error" });
  }
}



// ------------------------------- delete comment ----------------------------------
async function deleteCommentBlog(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    if (comment.user != userId && comment.blog.creator != userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action.",
      });
    }

    await Blog.findByIdAndUpdate(comment.blog._id, { $pull: { comments: id } });
    await Comment.findByIdAndDelete(id);
    return res
      .status(201)
      .json({ success: false, message: "Comment deleted succesfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "please try again.",
      error: error.message,
    });
  }
}



// --------------------------------update comment ----------------------------------
async function updateCommentBlog(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;
    const {comment} = req.body;
    const currentComment = await Comment.findById(id);

    if (!currentComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    if (currentComment.user != userId ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action.",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(id, {
      comment,
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated succesfully.",
      
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "please try again.",
      error: error.message,
    });
  }
}



// -------------------------------- like comment -----------------------------------
async function likeCommentBlog(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    if(!comment.likes.includes(userId)){
      await Comment.findByIdAndUpdate(id, {$push: {likes: userId}});

      return res
        .status(200)
        .json({success: false, message: "Comment like successfully."});
    }
    else{
      await Comment.findByIdAndUpdate(id, {$pull: {likes: userId}});

      return res
        .status(200)
        .json({success: false, message: "Comment Disliked successfully"})
    }
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "please try again.",
      error: error.message,
    });
  }
}


module.exports = {
  addCommentBlog,
  deleteCommentBlog,
  updateCommentBlog,
  likeCommentBlog,
};
