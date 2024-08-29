import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post/getposts');
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className='flex flex-col max-w-6xl gap-6 px-3 mx-auto lg:p-28'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to WebVoyage</h1>
        <p className='text-lg lg:text-xl'>
          WebVoyage is a platform where you can discover and share web content effortlessly. Post your own articles, view content from others, and engage with the community by leaving comments. You can also search for sites based on their categories, making it easy to find exactly what you're interested in.
        </p>
        <div className='mt-2'>
          <a 
            href='/search' 
            className='inline-block text-sm font-semibold text-blue-500 hover:underline hover:text-blue-700'
          >
            View All Posts
          </a>
        </div>
        <div className='grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3'>
          <div className='p-6 border rounded-lg'>
            <h2 className='text-xl font-semibold'>Easy to Use</h2>
            <p>WebVoyage is designed to be user-friendly, allowing anyone to easily post and explore web content.</p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h2 className='text-xl font-semibold'>Responsive Design</h2>
            <p>Our platform adapts to any device, providing an optimal viewing experience on both small and large screens, with fast response times.</p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h2 className='text-xl font-semibold'>Community Engagement</h2>
            <p>Interact with other users by leaving comments on posts and engaging in discussions about the content you love.</p>
          </div>
        </div>
        <div className='mt-12'>
          <h2 className='text-2xl font-semibold'>How It Works</h2>
          <ol className='mt-4 space-y-4'>
            <li><span className='font-bold'>1. Sign Up:</span> Create an account to start your journey.</li>
            <li><span className='font-bold'>2. Post Content:</span> Share your articles and insights with the community.</li>
            <li><span className='font-bold'>3. Explore & Engage:</span> Discover content by searching categories and leave comments.</li>
          </ol>
        </div>
        <div className='mt-12 text-center'>
          <a href='/sign-up' className='px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg'>
            Get Started Today
          </a>
        </div>
      </div>

      <div className='flex flex-col max-w-6xl gap-8 p-3 mx-auto py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent posts</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              {posts.map((post) => (
                <div className='flex justify-center'>
                  <PostCard key={post._id} post={post} className='w-full max-w-xs' />
                </div>
              ))}
            </div>
            <Link to={'/search'} className='text-lg text-center text-blue-500 hover:underline'>
            View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
