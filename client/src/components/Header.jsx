import { Button, Navbar, TextInput } from 'flowbite-react';
import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className = 'bg-blue-200 border-b-2'>
        <Link to="/" className='self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white'>
        <span className='px-2 py-1 text-white rounded-lg bg-gradient-to-r from-purple-700 to-blue-900'>WebVoyage</span>Site
        </Link>
        <form >
            <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
            />
        </form>
        <Button className='flex items-center justify-center w-12 h-10 lg:hidden' color='gray' >
            <AiOutlineSearch/>
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button className='flex items-center justify-center w-12 h-10 'color='gray'>
            <FaMoon/>
          </Button>
          <Link to='/sign-in'>
          <Button className='bg-blue-500' outline>Sign In</Button>
          </Link>
          <Navbar.Toggle/>
          </div>
          <Navbar.Collapse>
            <Navbar.Link active={path==="/"}  as={'div'}>
              <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path==="/about"} as={'div'}>
              <Link to='/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active={path==="/projects"} >
              <Link to='/projects'>Projects</Link>
            </Navbar.Link>
            
          </Navbar.Collapse>
        

    </Navbar>
  );
}
