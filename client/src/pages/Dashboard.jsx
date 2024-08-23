import React, { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl === 'profile'){
      setTab('profile');
    }
    if(tabFromUrl === 'posts'){
      setTab('posts');
    }
  },[location.search]
);
  

  return (
    <div className ="flex flex-col min-h-screen md:flex-row">
      <div className='md:w-56'>
      {/*Sidebar*/}
      <DashSidebar />
      </div>
      {/*profile*/}
      {tab === 'profile' && <DashProfile />}
      {/*posts*/}
      {tab === 'posts' && <DashPosts />}
    </div>
  );
}
