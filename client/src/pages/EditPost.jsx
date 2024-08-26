import React, { useState,useEffect } from 'react'
import { FileInput, Select, TextInput,Button, Alert } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getStorage,getDownloadURL,ref,uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate,useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
export default function EditPost() {
    const[file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [publishSuccess, setPublishSuccess] = useState(null);
    const navigate = useNavigate();
    const {postId} = useParams();
    const {currentUser} = useSelector((state)=>state.user);
    useEffect(() => {
        try {
          const fetchPost = async () => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message);
              setPublishError(data.message);
              return;
            }
            if (res.ok) {
              setPublishError(null);
              setFormData(data.posts[0]);
              console.log(data.posts[0].image)
            }
          };
    
          fetchPost();
        } catch (error) {
          console.log(error.message);
        }
      }, [postId]);
      useEffect(() => {
        if (formData.image) {
          setFormData({ ...formData, image: formData.image });
        }
      }, [formData.image]);
      
    const handleUploadImage = async () => {
        try {
          if (!file) {
            setImageUploadError('Please select an image');
            return;
          }
          setImageUploadError(null);
          const storage = getStorage(app);
          const fileName = new Date().getTime() + '-' + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
              setImageUploadError('Image upload failed');
              setImageUploadProgress(null);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageUploadProgress(null);
                setImageUploadError(null);
                setFormData({ ...formData, image: downloadURL });
              });
            }
          );
        } catch (error) {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.log(error);
        }
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`/api/post/updatePost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok)
            {
                setPublishError(data.message);
                return;
            }
            if(res.ok){
                setPublishError(null);
                setPublishSuccess('Post edited successfully');
                //navigate(`/post/${data.slug}`);
            }
            navigate('http://localhost:5173/dashboard?tab=profile');
        }
        catch(error){
            publishError('Failed to edit post');
        }
      }

  return (
    <div className='max-w-3xl min-h-screen p-3 mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
           Update post
        </h1>
        <form className='flex flex-col gap-4'
        onSubmit={handleSubmit}>
            <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                <TextInput 
                type='text' 
                placeholder='Title'
                required id ='title'
                className='flex-1'
                onChange={(e)=>
                setFormData({...formData, title:e.target.value})
                }
                value={formData.title}/>
                <Select
                onChange={(e)=>
                    setFormData({...formData, category:e.target.value})
                }
                value={formData.category}>
                    <option value="uncategorized">Select a category</option>
                    <option value="site">Site</option>
                    <option value='blog'>Blog</option>

                </Select>
            </div>
            <div className='flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted'>
                <FileInput type='file' accept='image/*'
                onChange={(e)=>setFile(e.target.files[0])}/>
                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline
                    onClick={handleUploadImage} disabled={imageUploadProgress}>
                        {
                            imageUploadProgress ? (
                                <div className='w-16 h-16'>
                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
                                    <span>Uploading...</span>
                                </div>
                            ):(
                                'Upload Image'
                            )
                    }
                    </Button>
            </div>
            {imageUploadError && 
                <Alert color='failure'>
                    {imageUploadError}
                </Alert>
            }
            {formData.image && (
                <img src={formData.image} alt='Uploaded' className='object-cover w-full h-72'/>
            )}
            <ReactQuill theme="snow" value={formData.content} placeholder='Write something amazing...'
            className='mb-12 h-72' 
            required
            onChange={(value)=>
                setFormData({...formData, content:value})
            }/>
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Edit
            </Button>
            {publishError &&
                <Alert className='mt-5' color='failure'>
                    {publishError}
                </Alert>
            }

        </form>
      
    </div>
  )
}
