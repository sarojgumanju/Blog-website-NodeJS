// import React, { useState } from "react";
// import { Navigate } from "react-router-dom";

// const CreateBlog = () => {
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const [blogData, setBlogData] = useState({
//     title: "",
//     description: "",
//     draft: false,
//   });

//   async function handleSubmit() {
//     console.log(blogData);
//     try {
//       let response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`, {
//         method: "POST",
//         body: JSON.stringify(blogData),
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       let res = await response.json();
//       alert(res.message);
//     } catch (error) {
//       alert("Something went wrong");
//       console.error("Error during signup:", error);
//     }
//   }

//   if (!user) return <Navigate to={"/signup"} />;

//   return (
//     <div>
//       <h1>CreateBlog</h1>
//       <div>
//         <div>
//           <input
//             onChange={(e) =>
//               setBlogData((prev) => ({
//                 ...prev,
//                 title: e.target.value,
//               }))
//             }
//             type="text"
//             placeholder="Enter your blog title"
//             name="title"
//             id="name"
//           />
//         </div>

//         <div>
//           <input
//             onChange={(e) =>
//               setBlogData((prev) => ({
//                 ...prev,
//                 description: e.target.value,
//               }))
//             }
//             type="text"
//             placeholder="description"
//             name="description"
//           />
//         </div>

//         <div>
//           <label htmlFor="">
//             <input
//               type="checkbox"
//               checked={blogData.draft}
//               onChange={(e) =>
//                 setBlogData((prev) => ({ ...prev, draft: e.target.checked }))
//               }
//             />
//             Save as draft
//           </label>
//         </div>

//         <button onClick={handleSubmit}>Submit</button>
//       </div>
//     </div>
//   );
// };

// export default CreateBlog;


import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  // get token from local Storage
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });

  async function handlePostBlog() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs`,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token},`
          },
        }
      );
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error)
    }
  }

  useEffect(() => {
    if(!token) return navigate ("/signup");
  })

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
          Blog Image
        </label>
        <input
          type="file"
          id="image"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none
        focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setBlogData((blogData) => ({
              ...blogData,
              image: e.target.files[0],
            }))
          }
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-300 p-2 text-1.5xl rounded-md"
        onClick={handlePostBlog}
      >
        Post Blog
      </button>
    </div>
  );
};

export default CreateBlog;
