import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import Sites from './pages/Sites'
import FooterComponent from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import PostPage from './pages/PostPage'
import ScrollTop from './components/ScrollTop'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollTop/>
    <Header/> 
    <Routes>
      <Route path= "/About" element={<About/>}/>
      <Route path= "/" element={<Home/>}/>
      <Route path= "/sign-in" element={<SignIn/>}/>
      <Route path= "/sign-up" element={<SignUp/>}/>
      <Route path='/search' element={<Search/>}/>
      <Route element = {<PrivateRoute/>}>
      <Route path= "/dashboard" element={<Dashboard/>}/>
      </Route>
      <Route path= "/create-post" element={<CreatePost/>}/>
      <Route path= "/update-post/:postId" element={<EditPost/>}/>
      <Route element = {<AdminPrivateRoute/>}>
      
      </Route>
      <Route path="/sites" element = {<Sites/>}/>
      <Route path="/post/:postSlug" element = {<PostPage/>}/>
      
    </Routes>
    <FooterComponent/>
    </BrowserRouter>
  )
}
