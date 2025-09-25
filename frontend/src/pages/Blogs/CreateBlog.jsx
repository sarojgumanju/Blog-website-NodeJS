
import axios from "axios";
import  { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateBlog = () => {
  const { id } = useParams();
  // get token from local Storage
  // const token = JSON.parse(localStorage.getItem("token"));
  const { token } = useSelector((state) => state.user);
  
  const navigate = useNavigate();

  const { title, description, image } = useSelector(
    (slice) => slice.selectedBlog
  );

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null
  });

  // for loading state
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isBlogPosting, setBlogPosting] = useState(false);

  async function handlePostBlog() {
    setBlogPosting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs`,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  }

  async function fetchBlogById() {
    setBlogData({
      title: title,
      description: description,
      image: image
    }); 
  }

  useEffect(() => {
    if(id) fetchBlogById();
    if (!token) return navigate("/signup");
  }, [id]);

  return (
    <div className="max-w-xl w-full mx-auto p-4">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={blogData.title}
          placeholder="Enter blog title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none
        focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setBlogData((blogData) => ({ ...blogData, title: e.target.value }))
          }
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          value = {blogData.description}
          placeholder="Enter blog description"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none
          focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setBlogData((blogData) => ({
              ...blogData,
              description: e.target.value,
            }))
          }
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {blogData.image ? (
            <div className="relative aspect-video">
              {isImageLoading && ( // checks if the image is still loading, if true render the spinner overlay
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              <img
                src={typeof blogData.image == "string" ? 
                  blogData.image :
                  URL.createObjectURL(blogData.image)
                }
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-slate-500 text-3xl text-white flex justify-center items-center">
              Blog image
            </div>
          )}
        </label>
        <input
          type="file"
          id="image"
         
          className=" hidden w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none
        focus:ring-2 focus:ring-blue-400"
          onChange={(e) => {
            setBlogData((blogData) => ({
              ...blogData,
              image: e.target.files[0],
            }));
            setIsImageLoading(true);
          }}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-300 p-2 text-1.5xl rounded-md"
        onClick={handlePostBlog}
        disabled={isBlogPosting}
      >
        {isBlogPosting ? "Posting..." : "Post Blog"}
      </button>
      {isBlogPosting && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white shadow-lg rounded-md p-6 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500     mb-4">
            </div>
            <p className="text-gray-700 font-medium">Posting your blog...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
