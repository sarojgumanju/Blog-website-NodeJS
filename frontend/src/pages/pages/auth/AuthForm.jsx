import { useState } from "react";
import {  Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";
import { useDispatch} from "react-redux";
import { login } from "../../../utils/userSlice";


const AuthForm = ({ type }) => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // handle input change
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

async function handleSubmit(e) {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/${type}`,
      userData,
    );
    
    if(type === "signup"){
      toast.success(response.data.message);
      navigator("/signin");
    }else{
      toast.success(response.data.message);
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      // localStorage.setItem("token", JSON.stringify(response.data.token));

      dispatch(
        login(
          {
          user: response.data.user,
          token: response.data.token,
        }
        ),
      );
      navigator('/create-blog')
     
    }
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {type === "signup" ? "Signup" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "signup" && (
            <div>
              <label className="block text-gray-600 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                onChange={(e) => {
                  setUserData((prev) => ({...prev, name: e.target.value}))
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => {
                  setUserData((prev) => ({...prev, email: e.target.value}))
                }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => {
                  setUserData((prev) => ({...prev, password: e.target.value}))
                }}
              
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {type === "signup" ? "Register" : "Login"}
          </button>
        </form>

        <div className="text-center text-gray-700 text-sm">
          {type === "signup" ? (
            <>
              Already have a account
              <Link
                to="/signin"
                className="text-blue-600 hover:underline ml-1 font-medium"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don't have an account?
              <Link
                to="/signup"
                className="text-blue-600 hover:underline ml-1 font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
