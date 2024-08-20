import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import { set } from 'mongoose';
import { signInStart,signInSucces,signInFailure } from '../redux/user/userSlice';
import {useDispatch,useSelector} from 'react-redux';
import OAuth from '../components/OAuth';
export default function SignIn() {
  const[formData, setFormData] = useState({});
  const {loading, error:errorMessage} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  };
  //console.log(formData);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill in all the fields'));
    }
    
    try{
      dispatch(signInStart());
      const response = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      if(data.success == false){
        dispatch(signInFailure(data.message));
      }
      if(response.ok){
        dispatch(signInSucces(data));
        navigate('/');
      }
    }catch(error){
      dispatch(signInFailure(error.message));
      
    }
    setLoading(false);
    
  }
  return (
    <div className ='min-h-screen mt-20'>
      <div className='flex flex-col max-w-3xl gap-5 p-3 mx-auto md:flex-row md:items-center'>
        {/*left side*/}
        <div className='flex flex-col items-center'>
          <Link to="/" className='font-bold dark:text-white'>
            <span className='px-2 py-1 text-4xl text-white rounded-lg bg-gradient-to-r from-purple-700 to-blue-900 mr-7'>WebVoyage</span>
          </Link>
          <p className='mt-2 text-center mr-7'>
            Sign in to get access your account
          </p>
        </div>
        {/*right side*/}
        <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value = 'Your email'/>
            <TextInput
            type='email'
            placeholder='Email'
            id='email' onChange={handleChange}/>
          </div>
          <div>
            <Label value = 'Your password'/>
            <TextInput
            type='password'
            placeholder='********'
            id='password' onChange={handleChange}/>
          </div>
          <Button className='bg-purple-700'type='submit' disabled={loading}>
            {
              loading ? (
              <>
              <Spinner size='sm'/>
              <span className='pl-3'>
                Loading...
              </span>
              </>
              ):'Sign In'
            }
          </Button>
          <OAuth/>
        </form>
        <div className='flex gap-2 mt-5 text-sm'>
          <span>
            Dont have an account?
          </span>
          <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
        </div>
        {
          errorMessage &&(
            <Alert className='mt-5' color='failure'
            >
              {errorMessage}
            </Alert>
          )
        }
        </div>
      </div>
    </div>
  )
}
