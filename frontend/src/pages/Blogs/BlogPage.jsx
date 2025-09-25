import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiDislike, BiLike } from "react-icons/bi";
import { MdInsertComment } from "react-icons/md";
import {
  addSelectedBlog,
  changeLike,
  removeSelectedBlog,
} from "../../utils/selectedBlogSlice";
import { setIsOpen } from "../../utils/commentSlice";
import Comment from "../../components/Comment/Comment";


const BlogPage = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState({});
  const dispatch = useDispatch();
  const { token, user } = useSelector((slice) => slice.user);
  const { likes, comments} = useSelector((slice) => slice.selectedBlog);
  const { isOpen } = useSelector((slice) => slice.commentBlog);
  const [islike, setIslike] = useState(false);
  const navigate = useNavigate();

  // ---------------------------- fetch blog --------------------------------------------
  async function fetchBlog() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/blogs/${id}`
      );
      setBlogData(response.data.blogs);

      if (response.data.blogs.likes.includes(user.id)) {
        setIslike((prev) => !prev);
      }
      toast.success(response.data.message);
      dispatch(addSelectedBlog(response.data.blogs));
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error fetching blogs: ", error);
    }
  }

  // ----------------------------- handle like ---------------------------------------------
  async function handleLike() {
    if (token) {
      setIslike((prev) => !prev);
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/like/${blogData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(changeLike(user.id));
      toast.success(res.data.message);
    } else {
      toast.error("Please signin to like this blog.");
    }
  }

  // ------------------------------ delete blog ----------------------------------------------
  async function handleDeleteBlog() {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/blogs/${blogData.blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Blog deleted successfully.");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "something went wrong";
      toast.error("Failed to deleter user:" + errorMessage);
    }
  }

  useEffect(() => {
    fetchBlog();
    dispatch(setIsOpen(false));
    return () => {
      if (window.location.pathname !== `/edit-blog/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
    // eslint-disable-next-line
  }, [id, location.pathname]);

  
  

  return (
    <div className="max-w-[1000px}">
      {blogData ? (
        <div>
          <h1 className="mt-10 font-bold">{blogData.title}</h1>
          <p className="mt-2 mb-1 text-gray-600">{blogData.description}</p>
          <img className="w-64" src={blogData.image} alt={blogData.title} />
          <h2 className="my text-3xl">{blogData.creator?.name}</h2>

          {/* ---------------------------- update -----------------------------------*/}
          {token && user.email === blogData.creator?.email && (
            <Link to={`/edit-blog/${blogData.blogId}`}>
              <button className="bg-green-400 mt-5 py-4 text-4xl rounded-md p-2">
                Update
              </button>
            </Link>
          )}

          {/* ---------------------------- delete -----------------------------------*/}
          {token && user.email === blogData.creator?.email && (
            <Link to={`/delete-blog/${blogData.blogId}`}>
              <button
                onClick={handleDeleteBlog}
                className="bg-red-300 mt-5 py-4 rounded-md p-2 text-4xl ml-4"
              >
                Delete blog
              </button>
            </Link>
          )}


          <div className="flex gap-3 mt-5 ">
             {/* ---------------------------- like -----------------------------------*/}
            <div className="flex gap-7 mt-2">
              <div className="cursor-pointer flex items-center">
                {islike ? (
                  <BiLike
                    className="text-3xl text-red-500"
                    onClick={handleLike}
                  />
                ) : (
                  <BiLike
                    className="text-3xl text-blue-500"
                    onClick={handleLike}
                  />
                )}
              </div>
              <p>{likes?.length}</p>
            </div>


            {/* ---------------------------- comment -----------------------------------*/}
            {/* <div >
              <Link to={`/comment-blog/${blogData.blogId}`}>
                <Link
                  to={"/comment-blog"}
                  className="bg-green-400 mt-5 ml-4 py-4 text-4xl rounded-md p-2"
                >
                  Comment
                </Link>
              </Link>
            </div> */}

              <div className="cursor-pointer flex items-center gap-4">
              <MdInsertComment
                className="text-3xl"
                onClick={() => dispatch(setIsOpen())}
              />
              <p className="text-3xl ">{comments?.length}</p>
            </div>
          </div>

        </div>
      ) : (
        <p>Loading...</p>
      )}
       {isOpen && <Comment />}
    </div>
  );
};

export default BlogPage;
