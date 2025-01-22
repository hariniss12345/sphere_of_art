import './App.css'
import {Link,Routes,Route} from 'react-router-dom'


import MainPage from './pages/MainPage'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'

export default function App () {
    return (
        <div className = "App">
          <ul id = "top-nav">
          <li><Link to = "/home" >Home</Link></li> 
          <li><Link to = "/register" >Register</Link></li>
          <li><Link to = "/login" >Login</Link></li>
          </ul>
          
          <Routes>
            <Route path = "/main" element = {<MainPage/>} />
            <Route path = "/home" element = {<Home/>} />
            <Route path = "/register" element = {<Register/>} />
            <Route path = "/login" element = {<Login/>} />

          </Routes>
        </div>
    )
}