import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import { setCommentLikes, setComments } from "../utils/selectedBlogSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { formatDate } from "../utils/formatDate";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  // console.log(comment);
  

  const { _id: blogId, comments } = useSelector((state) => state.selectedBlog);
  console.log(comments)
  console.log(blogId)
  const { token, user } = useSelector((slice) => slice.user);
  console.log(token)
  console.log(user)

  async function handleComment() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/comment/${blogId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setComments(response.data.createComment));
      setComment("");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message.data.message);
    }
  }

  async function handleCommentLike(commentId) {
    try {
        const res = await axios.patch(
            `${import.meta.env.VITE_API_URL}/blogs/like-comment/${commentId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        toast.success(res.data.message);
        dispatch(setCommentLikes({commentId, userId: user.id}));
    } catch (error) {
        console.log(error);
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
          className="resize-none h-[150px] w-full p-4 text-lg shadow-md   focus:outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          className="capitalize bg-green-500 px-5 py-3 my-2"
          onClick={handleComment}
        >
          add
        </button>
      </div>

      {comments.map((c) => {
        // console.log(c)
        return(
        <div key={c._id}
          className="flex flex-col gap-2 my-4 border-t-[0.3px] border-gray-300 pt-3"
        >
          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              <div className="w-10 h-10">
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${c?.user?.name}`}
                  alt={c?.user?.name}
                  className="rounded-full"
                />
              </div>
              <div className="">
                <p className="capitalize font-medium">{c?.user?.name}</p>
                <p>{formatDate(c.createdAt)}</p>
              </div>
            </div>
            <BsThreeDots />
          </div>
          <p className="font-medium text-lg">{c.comment}</p>
          <div className="cursor-pointer flex items-center gap-4 ">
            {c?.likes?.includes(user?.id) ? (
              <AiFillLike onClick={() => handleCommentLike(c._id)} className="text-blue-500 text-3xl " />
            ) : (
              <AiOutlineLike onClick={() => handleCommentLike(c._id)} className="text-3xl " />
            )}

            <p className="text-3xl ">{c?.likes?.length}</p>
          </div>
        </div>
      )})}
    </div>
  );
}

export default Comment;
