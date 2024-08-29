import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({searchTerm:'', sort:'desc',category:'uncategorized'});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if(searchTermFromUrl ||sortFromUrl || categoryFromUrl){
            setSidebarData(
                {...sidebarData,
                searchTerm:searchTermFromUrl,
                sort:sortFromUrl,
                category:categoryFromUrl});
        }
        const fetchPosts = async () => {
            setLoading(true);
            try{
                const search = new URLSearchParams(location.search);
                const res = await fetch(`/api/post/getposts?${search}`);
                if(!res.ok){
                    setLoading(false);
                    return;
                }
                if(res.ok)
                {
                    const data = await res.json();
                        setPosts(data.posts);
                        setLoading(false);
                        if(data.posts.length === 9){
                            setShowMore(true);
                        }
                        else{
                            setShowMore(false);
                }
            }}
            catch(error){
                console.log(error.message);
            }
            setLoading(false);
        }
        fetchPosts();
    }, [location.search]);
    const handleChange = (e) => {
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData,searchTerm:e.target.value});
        }
        if(e.target.id==='sort'){
            const order = e.target.value || 'desc';
            setSidebarData({...sidebarData,sort:order});
        }
        if(e.target.id==='category'){
            const category = e.target.value || 'uncategorized';
            setSidebarData({...sidebarData,category:category});
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('category',sidebarData.category);
        const search = urlParams.toString();
        navigate(`/search?${search}`);
    }
    const handleShowMore = async() => {
        const numberofPosts = posts.length;
        const startIndex = numberofPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex);
        const search = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${search}`);
        if(!res.ok){
            return;
        }
        if(res.ok){
            const data = await res.json();
            setPosts([...posts,...data.posts]);
            if(data.posts.length === 9){
                setShowMore(true);
            }
            else{
                setShowMore(false);
            }
        }
    }
        
  return (
    <div className='flex flex-col md:flex-row'>
    <div className='border-b border-gray-500 p-7 md:border-r md:min-h-screen'>
      <form className='flex flex-col gap-8'
      onSubmit={handleSubmit}>
        <div className='flex items-center gap-2'>
            <label className='font-semibold whitespace-nowrap'>
                Search term:
            </label>
            <TextInput
            placeholder='Search...'
            id='searchTerm'
            type='text'
            value={sidebarData.searchTerm}
            onChange={handleChange}>
            </TextInput>
        </div>
        <div className='flex items-center gap-2'>
            <label className='font-semibold whitespace-nowrap'>
                Sort by:
            </label>
            <Select 
            onChange={handleChange} 
            value={sidebarData.sort}
            id='sort'
            >
                <option value='desc'>Newest</option>
                <option value='asc'>Oldest</option>
            </Select>
        </div>
        <div className='flex items-center gap-2'>
            <label className='font-semibold whitespace-nowrap'>
                Category:
            </label>
            <Select 
            onChange={handleChange} 
            value={sidebarData.category}
            id='category'
            >
                <option value='uncategorized'>Uncategorized</option>
                <option value='site'>Site</option>
                <option value='blog'>Blog</option>
            </Select>
        </div>
        <Button
        type='submit'
        outline
        gradientDuoTone='purpleToBlue'>
            Search
        </Button>
      </form>
    </div>
    <div className='w-full'>
        <h1 className='p-3 mt-5 text-3xl font-semibold border-gray-500 sm:border-b'>
            Posts results:
        </h1>
        <div className='flex flex-wrap gap-4 p-7'>
            {
                !loading && posts.length === 0 && (
                <p className='text-xl text-gray-500'>
                    No posts found
                </p>
            )}
            {
                loading && (
                    <p className='text-xl text-gray-500'>
                        Loading...
                    </p>
                )
            }
            {
                !loading && posts && posts.map((post)=>(
                   <PostCard key={post._id} post={post}/>
                ))
            }
            {
                showMore &&(
                <button className='w-full text-lg text-center text-blue-500 hover:underline'
                onClick={handleShowMore}>
                    Show More
                </button>
            )}
        </div>
    </div>
    </div>
  )
}
