import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";


function usePagination(path, queryParams = {}, limit, page){
    const [hasMore, setHasMore] = useState(true);
    const [blogs, setBlogs] = useState([]);

    async function fetchSearchBlogs() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/${path}`, {
                    params: {...queryParams, limit, page},
                });
                setBlogs (
                    page === 1 ? res.data.blogs : (prev) => [...prev, ...res.data.blogs]
                );
                setHasMore(res.data.message);
                toast.success(res.data.message);
            } catch (error) {
                setBlogs([]);
                toast.error(error.response.data.message);
                console.error(error);
            }
        }

    useEffect(() => {
        fetchSearchBlogs();
    }, [page, queryParams.search]);
    return { blogs, hasMore}
}
    export default usePagination;
