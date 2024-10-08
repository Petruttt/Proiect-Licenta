import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import { set } from 'mongoose';
import OAuth from '../components/OAuth';
export default function SignUp() {
  const[formData, setFormData] = useState({});
  const[errorMessage, setErrorMessage] = useState(null);
  const[loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  };
  //console.log(formData);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill in all the fields');
    }
    
    try{
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch('/api/auth/signup',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      if(data.success == false){
        setErrorMessage(data.message);
      }
      if(response.ok){
        navigate('/sign-in');
      }
    }catch(error){
      setErrorMessage(error.message);
      
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
            Sign up to get access to all the features of our site
          </p>
        </div>
        {/*right side*/}
        <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value = 'Your username'/>
            <TextInput
            type='text'
            placeholder='Username'
            id='username' onChange={handleChange}/>
          </div>
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
            placeholder='Password'
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
              ):'Sign Up'
            }
          </Button>
          <OAuth/>
        </form>
        <div className='flex gap-2 mt-5 text-sm'>
          <span>
            Already have an account?
          </span>
          <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
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
