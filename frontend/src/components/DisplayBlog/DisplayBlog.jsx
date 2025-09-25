import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { MdInsertComment } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";

const DisplayBlog = ({ blogs }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Link
          to={`/blog/${blog?.blogId}`}
          key={blog?._id}
          className="my-10 flex flex-col-reverse md:flex-row gap-6 md:gap-10 border-b pb-10"
        >
          <div className="w-full md:w-[60%] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${blog?.creator?.name}`}
                alt={blog?.creator?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-sm font-semibold text-gray-800">
                {blog?.creator?.name}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {blog?.title}
              </h2>
              <p className="text-gray-700 line-clamp-3">{blog?.description}</p>
              <div className="flex gap-5 items-center">
                <p className="text-sm text-gray-500">
                  {formatDate(blog?.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <AiFillLike className="text-2xl" />
                  <span>{blog.likes.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdInsertComment className="text-2xl" />
                  <span>{blog.comments?.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[40%] flex justify-center">
            <img
              src={blog?.image}
              alt={blog?.title}
              className="w-full max-h-80 object-contain rounded-lg shadow-sm"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DisplayBlog;