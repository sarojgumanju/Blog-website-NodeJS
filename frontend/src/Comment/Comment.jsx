import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../../utils/commentSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { setComments, setCommentsLikes } from "../../utils/seletedBlogSlice";
import { formatDate } from "../../utils/formatDate";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const { _id: blogId, comments } = useSelector((state) => state.selectedBlog);
  const { token, user } = useSelector((slice) => slice.user);


  // -------------------------------- handle comment -----------------------------------
  async function handleComment() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/comment/${blogId}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setComments(res.data.createComment));
      setComment("");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }


  // -------------------------------- handle Comment like ------------------------------
  async function handleCommentLike(commentId) {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/blogs/like-comment/${commentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      dispatch(setCommentsLikes({ commentId, userId: user.id }));
    } catch (error) {
      console.log(error);
    }
  }


  // --------------------------------- handle delete -----------------------------------
  async function handleDelete(commentId) {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/blogs/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      dispatch(setComments(res.data.updatedComments));

      setTimeout(() => {
        window.location.reload();
      }, 1);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }


  // ---------------------------------- handle edit -------------------------------------
  async function handleEdit(commentId) {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/blogs/edit-comment/${commentId}`,
        { comment: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setComments(res.data.updatedComments));
      setEditId(null);
      setEditText("");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div
      className="bg-white p-5 h-screen fixed top-0 right-0 w-[400px]
     border-l drop-shadow-xl overflow-y-scroll"
    >
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Comment ({comments?.length})</h1>
        <IoMdClose
          onClick={() => dispatch(setIsOpen(false))}
          className="text-lg cursor-pointer"
        />
      </div>
      <div className="my-4">
        <textarea
          type="text"
          placeholder="Comment ..."
          className="resize-none h-[150px] w-full p-4 text-lg shadow-md focus:outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          onClick={handleComment}
          className="capitalize bg-green-500 px-5 py-3 my-2"
        >
          add
        </button>
      </div>

      {comments
        ?.filter((c) => c.user)
        .map((c) => (
          <div
            key={c._id}
            className="flex flex-col gap-2 my-4 border-t-[0.3px] border-gray-300 pt-3 relative"
          >
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                <div className="w-10 h-10">
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${c.user.name}`}
                    alt={c.user.name}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="capitalize font-medium">{c.user.name}</p>
                  <p>{formatDate(c.createdAt)}</p>
                </div>
              </div>

              {c.user._id === user.id && (
                <div className="relative">
                  <BsThreeDots
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenMenu(openMenu === c._id ? null : c._id)
                    }
                  />
                  {openMenu === c._id && (
                    <div className="absolute right-0 bg-white shadow-md rounded-md p-2 z-10">
                      <button
                        onClick={() => {
                          setEditId(c._id);
                          setEditText(c.comment);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {editId === c._id ? (
              <div>
                <textarea
                  className="w-full p-2 border rounded"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(c._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-medium text-lg">{c.comment}</p>
            )}

            <div className="cursor-pointer flex items-center gap-4 ">
              {c.likes.includes(user.id) ? (
                <AiFillLike
                  onClick={() => handleCommentLike(c._id)}
                  className="text-blue-500 text-3xl"
                />
              ) : (
                <AiOutlineLike
                  onClick={() => handleCommentLike(c._id)}
                  className="text-3xl"
                />
              )}
              <p className="text-3xl">{c.likes.length}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Comment;