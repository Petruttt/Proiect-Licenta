import { Button } from 'flowbite-react'
import React, { useEffect,useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import CommentSection from '../components/CommentSection'
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
    <main className='flex flex-col max-w-6xl min-h-screen p-3 mx-auto'>
        <h1 className='p-3 mx-auto mt-10 font-serif text-3xl text-center mx-w-2xl lg:text-4xl'>
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
            <div className='w-full max-w-2xl p-3 mx-auto post-content' dangerouslySetInnerHTML={{__html:post && post.content}}>
            </div>
            {post && post._id && <CommentSection postId={post._id} />}

    </main>
  )
}
