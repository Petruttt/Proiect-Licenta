import React, { useEffect, useRef } from 'react'
import {useSelector} from 'react-redux'
import { Alert, Button, TextInput } from 'flowbite-react'
import { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'


export default function DashProfile() {
  const {currentUser} = useSelector(state=>state.user)  
  const [imageFile,setImageFile]=useState(null);
  const [imageFileUrl,setImageFileUrl]=useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
  const [imageFileUpladError,setImageFileUploadError]=useState(null);
  //console.log(imageFileUploadProgress,imageFileUpladError);
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
      })
    }
    )
      
    
    
  }
  return (
    <div className='w-full max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
        <form className='flex flex-col gap-3'>
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
          <TextInput type='text' id='username' placeholder='username'
          defaultValue={currentUser.username}/>
          <TextInput type='email' id='email' placeholder='email'
          defaultValue={currentUser.email}/>
          <TextInput type='password' id='password' placeholder='password'/>
          <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            Update
          </Button>
        </form>
        <div className='flex justify-between mt-5 text-red-500'>
          <span className='cursor-pointer'> Delete Account </span>
          <span className='cursor-pointer'> Sign Out </span>
        </div>
    </div>
  )
}
