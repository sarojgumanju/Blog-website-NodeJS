const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const { generateJWt } = require("../utils/generateToken");

async function createUser(req, res) {
     try {
    // console.log(req.body);

    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      // if name password and email is not filled it gives the error
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // checking if the inpur email exist or not
    const checkForExistingUser = await User.findOne({ email });

    // if same email exist it gives error
    if (checkForExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered.",
      });
    }
    
    // converting password to different type
    const hashpassword = await bcrypt.hash(password, 10); // 10 repeats the password by 10 times

    // creating new user
    const newUser = await User.create({
      name,
      email,
      password: hashpassword,
    });

    let token = await generateJWt({
      email: newUser.email,
      id: newUser._id
    })

    return res.status(200).json({
      success: true,
      message: "User create successfully",
      user: {
      },
      token,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
}


//----------------------- get user ----------------------
async function getUser(req, res) {
     try {
        const users = await User.find();
        return res.status(200).json({
          success: true,
          message: "user fetched successfully",
          users: users, // users matra lekehney hunxa kina ki key and value ko name same xa
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "server error",
          error: error.message,
        });
      }
}


async function getUserById(req, res) {
    try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again.",
    });
  }
}


async function updateUser(req, res) {
    try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    const updateeUser = await User.findByIdAndUpdate(id, {name, email, password}, {new: true});
    
    if (!updateeUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      user: updateeUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}


async function deleteUser(req, res) {
    try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}


async function deleteAllUsers(req, res) {
  try {
    const result = await User.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All user deleted successfully.",
      deleteCount: result.deletedCount, // deletedCount counts the number of delete
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "please try again"
    });
  }
}


async function userLogin(req,res) {
  try {
    const { password, email} = req.body;
    if(!password || !email){
      return res
        .status(400)
        .json({
          success: false, 
          message: "Please fill the entire field."
        });
    }

    let checkForExistingUser = await User.findOne({email});
    let checkPassword = await bcrypt.compare(
      password,
      checkForExistingUser.password
    );

    if(!checkPassword){
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid candidate",
        })
    }

    let token = await generateJWt({
      email: checkForExistingUser.email,
      id: checkForExistingUser._id
    });

    // return res.status(201).json({
    //   success: true,
    //   message: "User login successfully",
    //   user: checkForExistingUser,
    //   token,
    // });

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user: {
        id: checkForExistingUser._id,
        name: checkForExistingUser.name,
        email: checkForExistingUser.email,
        blogs: checkForExistingUser.blogs,
      },
      token,
    });

  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "User does not exist. Please sign up first", error: error.message
      })
  }
}

module.exports = { createUser, getUser, getUserById, updateUser, deleteUser, deleteAllUsers, userLogin}