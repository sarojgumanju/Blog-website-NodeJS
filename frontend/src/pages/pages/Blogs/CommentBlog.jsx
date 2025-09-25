import React from "react";

const CommentBlog = () => {
  return (
    <div>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>

        <form className="flex flex-col space-y-4">
          <textarea
            placeholder="Write your comment here..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={5}
          ></textarea>

          <button
            type="submit"
            className="self-end bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentBlog;
