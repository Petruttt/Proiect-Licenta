import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'


export default function App() {
  return (
    <BrowserRouter>
    <Header/> 
    <Routes>
      <Route path= "/About" element={<About/>}/>
      <Route path= "/dashboard" element={<Dashboard/>}/>
      <Route path= "/home" element={<Home/>}/>
      <Route path= "/signin" element={<SignIn/>}/>
      <Route path= "/signup" element={<SignUp/>}/>
      
    </Routes>
    </BrowserRouter>
  )
}
