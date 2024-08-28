import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
export default function Comment({comment,onEdit}) {
    const  [user,setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
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
      const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
      };
      const handleSave = async () => {
        try {
          const res = await fetch(`/api/comment/editComment/${comment._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: editedContent,
            }),
          });
          if (res.ok) {
            onEdit(comment, editedContent);
            setIsEditing(false);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
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
            {isEditing ? (
              <>
              <Textarea
                className='mb-2'
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className='flex justify-end gap-2 text-xs'>
                <Button 
                className=''
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={handleSave}
                >
                  Save
                </Button>
                <Button 
                className=''
                type='button'
                size='sm'
                color='gray'
                outline
                onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
              </>
            ) : (
              <>
              <p className='pb-2 text-gray-500 dark:text-gray-300'>
                {comment.content}
            </p>
            {
              currentUser && currentUser._id === comment.userId && (
                <button 
                type='button'
                onClick={handleEdit}

                className='text-gray-500 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400'>
                    Edit
                </button>
              )
            }
              </>
            )}
            
        </div>
    </div>
  )
}
