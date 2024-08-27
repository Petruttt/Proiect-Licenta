import React, { useEffect, useState } from 'react'
import moment from 'moment';
export default function Comment({comment}) {
    const  [user,setUser] = useState({});
    console.log(user);
    useEffect(() => {
        const getUser = async () => {
          if (!comment.userId) {
            console.log("User ID is missing.");
            return;
          }
          try {
            const res = await fetch(`/api/user/${comment.userId}`);
            const data = await res.json();
            if (res.ok) {
              setUser(data);
            } else {
              console.log(`Error: ${res.statusText}`);
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        getUser();
      }, [comment]);
  return (
    <div className='flex p-4 text-sm border-b dark:border-gray-600'>
        <div  className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 bg-gray-200 rounded-full' src={user.profilePicture} alt={user.username}/>
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='mr-1 text-xs font-bold truncate'>
                    {user ? `@${user.username}` : 'anonymous user'} 
                </span>
                <span className='text-xs text-gray-500'>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            <p className='pb-2 text-gray-500 dark:text-gray-300'>
                {comment.content}
            </p>
        </div>
    </div>
  )
}
