const { verify } = require("jsonwebtoken");
const Blog = require("../model/blogSchema");
const User = require("../model/userSchema");
const { verifyJWT } = require("../utils/generateToken");
const {uploadImage, deleteImagefromCloudinary} = require("../utils/uploadImage");
const  ShortUniqueId = require('short-unique-id');
const {randomUUID} = new ShortUniqueId({length:20});
const fs = require("fs");

// -------------------- create blog using post --------------------------
// async function createBlog(req, res) {
//   try {
//     const { title, description, draft, creator } = req.body;
//     // console.log(title, description, draft, creator);
//     const findUser = await User.findById(creator);
//     if (!findUser) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Users not found." });
//     }

//     if (!title || !description) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Please enter all fields." });
//     }

//     const blog = await Blog.create({ title, description, draft, creator });
//     await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });
//     return res
//       .status(201)
//       .json({ success: true, message: "Blog created successfully", blog });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "server error",
//       error: error.message,
//     });
//   }
// }

// ------------------- create blog with token ----------------------------
async function createBlog(req, res) {
  try {
    const creator = req.user;
    const image = req.file;
    const { title, description, draft } = req.body;
    // console.log(req.user)
    // if(!req.body.token){
    //   return res
    //     .status(200)
    //     .json({ message: "Please sign in."})
    // }

    let isValid = await verifyJWT(req.body.token);
    console.log(isValid);
    

    // console.log(title, description, draft);
    const findUser = await User.findById(creator);
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "Users not found." });
    }

    if (!title || !description) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter all fields." });
    }

    const { secure_url,public_id} = await uploadImage(image.path);
    fs.unlinkSync(image.path);
    const blogId = 
     title.toLowerCase().split(" ").join("-") + "-" + randomUUID();

    const blog = await Blog.create({ 
      title, 
      description, 
      draft, 
      creator,
      image: secure_url,
      imageId: public_id,
      blogId,
     });

    await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

    return res
      .status(201)
      .json({ success: true, message: "Blog created successfully", blog });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}

// ----------------------- delete -----------------------
// async function deleteBlog(req, res) {
//   try {
//     const {id} = req.params;

//     // check if the blog exists or not
//     const blog = await Blog.findById(id);
//     if(!blog) {
//       return res.status(404)
//         .json({
//           success: false,
//           message: "Blog not found."
//         });
//     }

//     // Deleting the blog
//     await Blog.findByIdAndDelete(id);

//     // remove the blog refernece from the user
//     // await User.findByIdAndUpdate(blog.creator, {
//     //   $pull: {blogs: blog._id}
//     // });

//     return res.status(200).json({
//       success: true,
//       message: "Blog deleted succesfully"
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "please try again."
//     });
//   }
// }

// -------------------------- get all ------------------------
async function getBlogs(req, res) {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page-1) * limit;

    const blogs = await Blog.find({ draft: false }).populate({
      path: "creator",
      select: "name email",
    }) // draft false xa vaney show hunxa
    .sort({creator: -1})
    .skip(skip)
    .limit(limit);

    const totalBlogs = await Blog.countDocuments({draft: false});

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully.",
      blogs,
      hasMore: skip + limit < totalBlogs,
      totalBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}


// ------------------------- get by id --------------------------------
async function getBlogById(req, res) {
  try {
    const {blogId} = req.params;
    const blogs = await Blog.findOne({blogId})
    .populate({
      path: 'creator',
      select: "name email",
    })
    .populate({
      path: 'comments',
      populate: {
        path: "user",
        select: "name email",
      }
    });

    if (!blogs) {
      return res.status(404).json({
        success: false,
        message: "Blog nor found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched succesfully.",
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}

// ------------------------ update Blog -----------------------------------
async function updateBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const { title, description, draft } = req.body;
    const image = req.file;

    const blog = await Blog.findOne({blogId: id});
    if (!blog) {
      return res
        .status(404)
        .json({ success: true, message: "Blog not found," });
    }

    if (!(creator == blog.creator)) {
      return res.status(403).json({
        success: false,
        message: "you are not authorized for this action.",
      });
    }

    if(image){
      await deleteImagefromCloudinary(blog.imageId);
      const { secure_url, public_id } = await uploadImage(image.path);
      blog.image = secure_url;
      blog.imageId = public_id;
      fs.unlinkSync(image.path);
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.draft = draft || blog.draft;
    await blog.save();

    // const updatedBlog = await Blog.findByIdAndUpdate(
    //   id,
    //   { title, description, draft },
    //   { new: true } // updated value lina ko lagi
    // );

    return res.status(200).json({
      success: true,
      message: "Blog updated succesfully.",
      // blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating blog",
    });
  }
}

// ------------------------ delete --------------------------------------------
// async function deleteBlog(req, res) {
//   try {
//     const {id} = req.params;
//     const deletedBlog = await Blog.findByIdAndDelete(id);

//     if(!deletedBlog){
//       return res
//         .status(404)
//         .json({success: false, message: "Blog nor found."})
//     }

//     return res
//       .status(200)
//       .json({success: true, message: "Blog deleted successfully."});

//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Please try again"})
//   }
// }

async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    const creator = req.user;

    const blog = await Blog.findOne({blogId: id});
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    }

    if (!(creator == blog.creator)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action",
      });
    }

    await deleteImagefromCloudinary(blog.imageId);
    await Blog.findOneAndDelete({blogId: id});
    await User.findByIdAndUpdate(creator, { $pull: { blogs: blog._id } });
    return res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Please try again" });
  }
}

// ------------------------------ like --------------------------------------------
async function likeBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    }
    if (!blog.likes.includes(creator)) {
      await Blog.findByIdAndUpdate(id, { $push: { likes: creator } });
      return res
        .status(200)
        .json({ success: true, message: "Blog liked successfully." });
    } else {
      await Blog.findByIdAndUpdate(id, { $pull: { likes: creator } });
      return res
        .status(200)
        .json({ success: false, message: "Blog disliked successfully." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "please try again" });
  }
}


// ------------------------------- searchBlog-----------------------------------------
async function searchBlogs(req,res) {
  try {
    const { search } = req.query;
    console.log(search)
    const blogs = await Blog.find({
      $or: [
        {title: {$regex: search, $options: "i"}},
        {description: {$regex: search, $options: "i"}},
      ]
    })
    if(blogs.length==0){
      return res.status(400).json({
        success: false,
        message: "Make sure that all words are spelled correctly."
    });
    }

    return res.status(200).json({
      message: `Found ${blogs.length} result for "${search}"`,
      blogs,
    })
  } catch (error) {
    return res.status(500).json({
      message: "please enter the search item correctly."
    })
  }
  
}


// multer and cloudnare

module.exports = {
  createBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  likeBlog,
  searchBlogs
};
