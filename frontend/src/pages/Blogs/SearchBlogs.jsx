
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import usePagination from '../../hooks/usePagination';
import DisplayBlog from '../../components/DisplayBlog/DisplayBlog';

const SearchBlogs = () => {
    const [page, setPage] = useState(1);
    const [ searchParams] = useSearchParams();
    const  q = searchParams.get("q");
    const { blogs, hasMore} = usePagination(
        "blogs/search-blogs",
        { search: q },
        1,
        page
    );

    
  return (
    <div className='w-[50%] mx-auto'>
      <h1>
        Results for <span className='text-black'>{q}</span>
        {blogs.length > 0 && (
            <span className='ml-2 text-base text-gray-500'>({blogs.length})</span>
        )}
      </h1>
      {blogs.length === 0 ? (
        <p className='text-center'>No blogs found</p>
      ): (
        <DisplayBlog blogs={blogs} />
      )}
      {hasMore && (
        <button onClick={() => setPage((prev) => prev+1)}>Load More</button>
      )}
    </div>
  )
}

export default SearchBlogs
