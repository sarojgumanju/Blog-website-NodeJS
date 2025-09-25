import React from "react";
import {Routes,Route} from "react-router-dom"
import "./App.css";
import { Blogs, CreateBlog, AuthForm, BlogPage, CommentBlog } from "./pages";
import Navbar from "./Navbar/Navbar";
import SearchBlogs from "./pages/pages/Blogs/SearchBlogs";




function App() {
  return (
    <>
      <Routes>
       <Route path="/" element={<Navbar/>}>
        <Route path="/" element={<Blogs />} />
        <Route path="/signup" element={<AuthForm type={"signup"} />} />
        <Route path="/signin" element={<AuthForm type={"signin"} />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/comment-blog" element={<CommentBlog />} />
        <Route path="blog/:id" element={<BlogPage />} />
        <Route path="/edit-blog/:id" element={<CreateBlog />} />
        <Route path="/search" element={<SearchBlogs />} />
        <Route path="*" element={<>Not found</>} />
       </Route>
      </Routes>
    </>
  );
}

export default App;
