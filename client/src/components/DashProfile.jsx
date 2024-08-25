import React, { useEffect, useRef } from 'react'
import {useSelector} from 'react-redux'
import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { updateStart,updateSucces,updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutSuccess} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { set } from 'mongoose'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import error from '../redux/user/userSlice'
import { Link } from 'react-router-dom'
export default function DashProfile() {
  const {currentUser,error,loading} = useSelector(state=>state.user)  
  const [imageFile,setImageFile]=useState(null);
  const [imageFileUrl,setImageFileUrl]=useState(null);
  const [updateUserSucces,setUpdateUserSucces]=useState(null);
  const [updateUserError,setUpdateUserError]=useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
  const [imageFileUpladError,setImageFileUploadError]=useState(null);
  const [showModal,setShowModal]=useState(false);
  //console.log(imageFileUploadProgress,imageFileUpladError);
  const  [formData,setFormData]=useState({});
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
    
  }
  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile])
  
  const uploadImage = async () => {
    /*
    service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2*1024*1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}
    */
   setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime()+imageFile.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,imageFile);
    uploadTask.on(
      'state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      setImageFileUploadProgress(progress.toFixed(0));
    },
    (error)=>{
      setImageFileUploadError('Could not upload the image(File must be less than 2MB)');
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      
    },
    ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setImageFileUrl(downloadURL);
        setImageFileUploadProgress(null);
        setFormData({...formData,profilePicture:downloadURL});
      })
    }
    )
      
    
    
  }
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value});
  };
  //console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSucces(null);
    if(Object.keys(formData).length===0){
      setUpdateUserError('No data to update');
      return;
    }
    try{
      dispatch(updateStart());
      /*const res = await fetch ('/api/user/update/${currentUser._id}',{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      });
      */
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        }else{
          dispatch(updateSucces(data));
          setUpdateUserSucces('User updated successfully');
          
        }
    }
    catch(err){
      dispatch(updateFailure(error.message));
    }
  }
  const handleDeleteUser = async () => {
    setShowModal(false);
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }
      else{
        dispatch(deleteUserSuccess(data));
      }
        
    }
    catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }
  const handleSignout = async () => {
    try{
      const res= await fetch('/api/user/signout',{
        method:'POST'
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        dispatch(signoutSuccess(data));
      }
    }
    catch(error){
      console.log(error.message);
    }
  }
  
  return (
    <div className='w-full max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input type="file" accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden/>
          <div className = 'relative self-center w-32 h-32 overflow-hidden rounded-full shadow-md cursor-pointer'
          onClick={()=>filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0}
             text={`${imageFileUploadProgress}%`}
             strokeWidth={5}
             styles={
              {
                root:{
                  width:'100%',
                  height:'100%',
                  position:'absolute',
                  top:0,
                  left:0
                },
                path:{
                  stroke:'rgba(62,152,199,${imageFileUploadProgress/100})'
                },
              }
            }
                />  
          )}
           <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />

          </div>
          {imageFileUpladError && <Alert color='failure'>{imageFileUpladError}</Alert>}
          <TextInput 
          type='text' 
          id='username' 
          placeholder='username'
          defaultValue={currentUser.username} onChange={handleChange}/>
          <TextInput 
          type='email' 
          id='email' 
          placeholder='email'
          defaultValue={currentUser.email} onChange={handleChange}/>
          <TextInput 
          type='password' 
          id='password' 
          placeholder='password' onChange={handleChange}/>
          <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            Update
          </Button>
          {
              <Link to={'/create-post'}>
              <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'>
                Create a post
              </Button>
              </Link>}
        </form>
        <div className='flex justify-between mt-5 text-red-500'>
          <span onClick={()=>setShowModal(true)} className='cursor-pointer'> Delete Account </span>
          <span onClick={handleSignout} className='cursor-pointer'> Sign Out </span>
        </div>
        {updateUserSucces && <Alert color='success' className='mt-5'>{updateUserSucces}</Alert>}
        {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
        {error && <Alert color='failure' className='mt-5'>{error}</Alert>}
        <Modal show = {showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                  Are you sure you want to delete your account?
                </h3>
                <div className='flex justify-center gap-12'>
                  <Button color='failure' onClick={handleDeleteUser}>
                    Yes, I'm sure
                  </Button>
                  <Button color='gray' onClick={()=>setShowModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
