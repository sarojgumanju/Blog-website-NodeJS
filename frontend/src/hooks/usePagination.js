import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function usePagination(path, queryParams = {}, limit, page) {
  const [hasMore, setHasMore] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchSearchBlogs() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/${path}`, {
          params: { ...queryParams, limit, page },
        });
        setBlogs(
          page === 1 ? res.data.blogs : (prev) => [...prev, ...res.data.blogs]
        );
        setHasMore(res.data.hasMore);
        toast.success(res.data.message);
      } catch (error) {
        setBlogs([]);
        toast.error(error.response.data.message);
        console.error(error);
      }
    }
    fetchSearchBlogs();
    // eslint-disable-next-line
  }, [page, queryParams.search]);
  return { blogs, hasMore };
}

export default usePagination;