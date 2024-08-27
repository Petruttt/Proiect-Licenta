import { Button } from 'flowbite-react'
import React, { useEffect,useState } from 'react'
import {Link, useParams} from 'react-router-dom'
export default function PostPage() {
    const {postSlug} = useParams()
    const[error, setError] = useState(null)
    const[post, setPost] = useState(null)
    useEffect(() => {
        const fetchPost = async () => {
            try{
                const res= await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                if(res.ok){
                    setPost(data.posts[0]);
                    setError(null)
                    
                    
                }
                else{
                    setError(data.message)
                    return;
                }

            }
            catch(error){
                setError(error.message)
            }
        };
        fetchPost();
    }, [postSlug])
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif mx-w-2xl mx-auto lg:text-4xl'>
            {post && post.title}
            
            
        </h1>
            <Link to={`/search?category=${post && post.category}`}
            className='self-center mt-5'>
            <Button color='gray' pill size='xs'>
            {post && post.category}
            </Button>
            </Link>
            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
            <div className='flex justify-between p-3 border-b border-slate-400 '>
                <span>
                    {post && new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className='ml-5'>
                    {post && post.author}
                </span>
            </div>
            <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html:post && post.content}}>

            </div>
    </main>
  )
}
