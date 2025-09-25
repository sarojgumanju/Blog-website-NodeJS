import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../utils/userSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/signin");
  };


  async function handleDeleteUser() {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ){
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.delete (
        `${import.meta.env.VITE_API_URL}/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(logout());
      toast.success(response.data.message || "Account deleted successfully");
      navigate("/signin");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "something went wrong";
      toast.error("Failed to delete user:" + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    if(window.location.pathname !== "/search"){
      setSearchQuery(null);
    }
  }, [window.location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex justify-between items-center bg-gray-700 text-white h-[70px] px-6  ">
        <div className="text-xl font-bold">Blog App</div>

        {user ? (
          <div>
            {user.name}
            <br />
            <button onClick={handleLogOut}>LogOut</button>
          </div>
        ) : (
          <Link to={"/signin"}>Login </Link>
          
        )}

        <div>
          <input type="text"
          className="bg-gray-100 rounded-md text-black text-bold p-2 border-amber-200"
          placeholder="search"
          value = {searchQuery? searchQuery: ""}
          onChange={(e) => setSearchQuery(e.target.value.trimStart())}
          onKeyDown={(e) => {
            if(e.code=="Enter"){
              navigate(`search?q=${searchQuery.trim()}`)
            }
          }}
          />
        </div>

        {/* Nav items */}
        <ul className="flex gap-6">
          <li>
            <Link to="/" className="hover:text-gray-300 transition">
              Home
            </Link>
          </li>

          <li>
            <Link to="/signup" className="hover:text-gray-300 transition">
              Sign Up
            </Link>
          </li>

          <li>
            <Link to="/create-blog" className="hover:text-gray-300 transition">
              Create Blog
            </Link>
          </li>
          
          <li>
            <button  className="hover:text-gray-300 transition"
              onClick={handleDeleteUser}
              disabled = {loading}
            >
              {loading? "Deleting..." : "Delete Account"}
            </button>
          </li>
        </ul>

        
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
