import { Alert, Button, Textarea} from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import Comment from './Comment';

export default function CommentSection({postId}) {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    console.log(comments);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (comment.length > 200) {
        return;
      }
      try {
        const res = await fetch('/api/comment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: comment,
            postId,
            userId: currentUser._id,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setComment('');
          setCommentError(null);
          setComments([data, ...comments]);
        }
      } catch (error) {
        setCommentError(error.message);
      }
    };
    useEffect(() => {
      const getComments = async () => {
        try {
          const res = await fetch(`/api/comment/getpostcomments/${postId}`);
         if(res.ok){
          const data = await res.json();
          setComments(data);
         }
        } catch (error) {
          console.log(error);
        }
      }
      getComments();

    }
    , [postId]);
    
    const handleEdit= async (comment, editedContent) => {
      setComments(
        comments.map((c) =>
          c._id === comment._id ? { ...c, content: editedContent } : c
        )
      );
    }
      

  return (
    <div>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-sm text-gray-500'>
          <p>Signed in as:</p>
          <img
            className='object-cover w-5 h-5 rounded-full'
            src={currentUser.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='flex gap-1 my-5 text-sm text-orange-700'>
          You must be signed in to comment.
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit}
         className='p-3 border border-blue-500 rounded-md'>
            <Textarea
            placeholder='Write a comment...'
            rows='3'
            maxLength={300}
            onChange={(e) =>setComment(e.target.value)}
            value={comment}/>
            <div className='flex items-center justify-between mt-5'>
                <p className='text-xs text-gray-500'>
                   {300-comment.length} characters remaining
                </p>
                <Button outline gradientDuoTone='purpleToBlue'
                type='submit'>
                    Submit
                </Button>
            </div>
            {commentError && (
            <Alert color='failure' className='mt-5'>
             {commentError}
             </Alert>)
            }
             </form>
            )}
            {comments.length ===0 ?(
              <p className='my-5 text-sm'>
                No comments yet!
              </p>)
              :(
                <>
                <div className='flex items-center gap-1 my-5 text-sm'>
                  <p>Comments</p>
                <div className='px-2 py-1 border border-gray-500 rounded-sm'>
                    <p>
                      {comments.length}
                    </p>
                </div>
                </div>
                {
                  comments.map((comment) => (
                    <Comment
                    key={comment._id}
                    comment={comment}
                    onEdit={handleEdit}
                    />
                ))}
                </>
              )}
    </div>
  )
}
