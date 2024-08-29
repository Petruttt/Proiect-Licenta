import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon,FaSun } from 'react-icons/fa';
import { useSelector,useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/tema/temaSlice';
import { signoutSuccess } from '../redux/user/userSlice';
export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.user);
  const {tema} = useSelector(state => state.tema);
  const [searchTerm,setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  
  
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
    const search = urlParams.toString();
    navigate(`/search?${search}`);
  }
  return (
    <Navbar className = 'bg-blue-200 border-b-2'>
        <Link to="/" className='self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white'>
        <span className='px-2 py-1 text-white rounded-lg bg-gradient-to-r from-purple-700 to-blue-900'>WebVoyage</span>Site
        </Link>
        <form onSubmit={handleSubmit}>
            <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            />
        </form>
        <Button className='flex items-center justify-center w-12 h-10 lg:hidden' color='gray' >
            <AiOutlineSearch/>
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button className='flex items-center justify-center w-12 h-10 'color='gray' pill
          onClick={()=>dispatch(toggleTheme())}>
           {tema === 'light' ? <FaMoon/> : <FaSun/>}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon = {false}
              inline
              label={
                <Avatar
                alt = 'user'
                img = {currentUser.profilePicture}
                rounded
                />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>
                  @{currentUser.username}
                </span>
                <span className='block text-sm font-medium truncate '>
                  {currentUser.email}
                </span>
                </Dropdown.Header>
                <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>
                  Profile
                </Dropdown.Item>
                </Link>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={handleSignout}>
                  Sign Out
                </Dropdown.Item>
              </Dropdown>
          ):
          ( <Link to='/sign-in'>
          <Button className='bg-blue-500' outline>Sign In
          </Button>
          </Link>
          )}
          <Navbar.Toggle/>
          </div>
          <Navbar.Collapse>
            <Navbar.Link active={path==="/"}  as={'div'}>
              <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path==="/about"} as={'div'}>
              <Link to='/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active={path==="/about"} as={'div'}>
              <Link to='/search'>Sites</Link>
            </Navbar.Link>
            
          </Navbar.Collapse>
        

    </Navbar>
  );
}
