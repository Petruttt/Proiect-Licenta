import React from 'react'
import{Footer, FooterDivider} from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook,BsInstagram,BsTwitter,BsGithub } from 'react-icons/bs'

export default function FooterComponent() {
  return (
    <Footer container className='border border-t-8 border-purple-400'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex '>
            <div className='mt-5'>
            <Link to="/" className='self-center whitespace-nowrap
         text-lg sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-purple-700
         to-blue-900 rounded-lg text-white'>WebVoyage</span>Site
        </Link>
            </div>
            <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                <div>
                <Footer.Title title='About'></Footer.Title>
                <Footer.LinkGroup col>
                <Footer.Link 
                    href= 'https://www.mongodb.com/'
                    target='_blank'
                    rel='noopener noreferrer'>
                        Test-MongoDB
                 </Footer.Link>
                 <Footer.Link 
                    href= '/about'
                    target='_blank'
                    rel='noopener noreferrer'>
                        WebVoyage
                 </Footer.Link>
                </Footer.LinkGroup>
                </div>
                <div>
                <Footer.Title title='Folow us'></Footer.Title>
                <Footer.LinkGroup col>
                <Footer.Link 
                    href= 'https://github.com/Petruttt'
                    target='_blank'
                    rel='noopener noreferrer'>
                        GitHub
                 </Footer.Link>
                 <Footer.Link 
                    href= '#'>
                        Discord
                 </Footer.Link>
                </Footer.LinkGroup>
                </div>
                <div>
                <Footer.Title title='Legal'></Footer.Title>
                <Footer.LinkGroup col>
                <Footer.Link 
                    href= '#'>
                        Privacy Policy
                 </Footer.Link>
                 <Footer.Link 
                    href= '#'>
                        Terms & Conditions
                 </Footer.Link>
                </Footer.LinkGroup>
                </div>
            </div>
        </div>
        <FooterDivider/>
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright 
                href='#'
                by='WebVoyage'
                year={new Date().getFullYear()}/>
                <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <Footer.Icon href='#' icon={BsFacebook}/>
                    <Footer.Icon href='#' icon={BsInstagram}/>
                    <Footer.Icon href='#' icon={BsGithub}/>
                    <Footer.Icon href='#' icon={BsTwitter}/>
                </div>
            </div>

      </div>
    </Footer>
  )
}
