
import { useEffect, useState } from "react";

import DisplayBlog from "../../components/DisplayBlog/DisplayBlog";
import usePagination from "../../hooks/usePagination";

const Blogs = () => {
  const [page, setPage] = useState(1);
  const {blogs, hasMore} = usePagination("blogs", {}, 4, page);
  
  // ----------------------------------------------------------------------------------
  // const [like, setLike] = useState(0, () => {
  //   const saveLike = localStorage.getItem("likeCount");
  //   return saveLike ? JSON.parse(saveLike) : 0;
  // });

  // function handleLike() {
  //   setLike((prev) => prev + 1);
  // }
  // function handleDislike() {
  //   setLike ((prev) => prev>0 ? prev-1 : 0);
  // }

  // useEffect(() => {
  //   localStorage.setItem("likeCount", JSON.stringify(like));
  // }, [like]);

  // ---------------------------------------------------------------------------------

console.log(blogs)
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <DisplayBlog blogs={blogs}/>
      {hasMore && (
        <button onClick={() => setPage((prev) => prev+1)}>Load more</button>
      )}
    </div>
  );
};

export default Blogs;
