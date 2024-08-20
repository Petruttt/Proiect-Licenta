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

export default function App() {
  return (
    <BrowserRouter>
    <Header/> 
    <Routes>
      <Route path= "/About" element={<About/>}/>
      <Route path= "/home" element={<Home/>}/>
      <Route path= "/sign-in" element={<SignIn/>}/>
      <Route path= "/sign-up" element={<SignUp/>}/>
      <Route element = {<PrivateRoute/>}>
      <Route path= "/dashboard" element={<Dashboard/>}/>
      </Route>
      <Route path="/sites" element = {<Sites/>}/>
      
    </Routes>
    <FooterComponent/>
    </BrowserRouter>
  )
}
