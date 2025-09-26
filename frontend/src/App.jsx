import {Routes,Route} from "react-router-dom"
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { AuthForm, BlogPage, Blogs, CreateBlog, SearchBlogs } from "./pages";
import VerifyUser from "./pages/auth/VerifyUser";


function App() {
  return (
    <>
      <Routes>
       <Route path="/" element={<Navbar/>}>
        <Route path="/" element={<Blogs />} />
        <Route path="/signup" element={<AuthForm type={"signup"} />} />
        <Route path="/signin" element={<AuthForm type={"signin"} />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="blog/:id" element={<BlogPage />} />
        <Route path="/edit-blog/:id" element={<CreateBlog />} />
        <Route path="/search" element={<SearchBlogs />} />
        <Route path="/verify-email/:verificationToken" element={<VerifyUser />} />
        <Route path="*" element={<>Not found</>} />
       </Route>
      </Routes>
    </>
  );
}

export default App;
