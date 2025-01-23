import './App.css'
import {Link,Routes,Route} from 'react-router-dom'


import MainPage from './pages/MainPage'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FindArtist from './pages/FindArtist'
import Order from './pages/Order'
import Profile from './pages/Profile'

export default function App () {
    return (
        <div className = "App">
          <ul id = "top-nav">
          <li><Link to = "/home" >Home</Link></li> 
          <li><Link to = "/register" >Register</Link></li>
          <li><Link to = "/login" >Login</Link></li>
          <li><Link to = "/dashboard" >Dashboard</Link></li>
          <li><Link to = "/findartist" >Find Your Artist</Link></li>
          <li><Link to = "/order" >Order</Link></li>
          <li><Link to = "/profile">Profile</Link></li>
          </ul>
          
          <Routes>
            <Route path = "/main" element = {<MainPage/>} />
            <Route path = "/home" element = {<Home/>} />
            <Route path = "/register" element = {<Register/>} />
            <Route path = "/login" element = {<Login/>} />
            <Route path = "/dashboard" element = {<Dashboard/>} />
            <Route path = "/findartist" element = {<FindArtist/>} />
            <Route path = "/order" element = {<Order/>} />
            <Route path = "/profile" element = {<Profile/>} />

          </Routes>
        </div>
    )
}