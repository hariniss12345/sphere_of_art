import { useState } from "react"
import AuthContext from "../context/Auth.js";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
export default function Login(){
    const { handleLogin } = useContext(AuthContext); 
    const navigate = useNavigate(); 
    const [formData, setFormadata] = useState({
        username:"",
        email : "",
        password : ""
    });
    const [clientErrors, setClientErros] = useState(null);
    const [serverErrors, setServerErrors] = useState(null); 
    const clientValidationsErrors = {};


    const runClientValidations = ()=>{
        if(formData.username.trim().length === 0){
            clientValidationsErrors.username = 'username is required'
        }

        if(formData.password.trim().length === 0){
            clientValidationsErrors.password = 'password is required'
        }

        if(formData.email.trim().length === 0){
            clientValidationsErrors.email = 'email is required'
        }

    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        runClientValidations();
        if(Object.keys(clientValidationsErrors).length == 0) {
            try {
               const response = await axios.post('http://localhost:4700/api/users/login',formData)
               //console.log(response.data)
               localStorage.setItem('token',response.data.token)
               const userResponse=await axios.get('http://localhost:4700/api/users/profile',{headers:{Authorization:localStorage.getItem('token')}})
               //console.log(userResponse.data)
               handleLogin(userResponse.data)
               navigate('/dashboard')
            } catch(err) {
                setServerErrors(err.response.data.errors); 
            }
            setClientErros({})
        } else {
            
            setClientErros(clientValidationsErrors); 
        }
    }

    return(
        <div className="login">
            <h2>Login page</h2>
            { serverErrors && (
                <div>
                    <b>{ serverErrors }</b>
                </div>
            )}
            <form onSubmit={handleSubmit}>
            <input 
                    type="text" 
                    value={formData.username} 
                    onChange={(e)=> setFormadata({...formData, username:e.target.value})}
                    placeholder="Enter username" 
                />
                {clientErrors && <span style={{color:'red'}}>{clientErrors.username}</span>}
                <br/>
                <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e)=> setFormadata({...formData, email:e.target.value})}
                    placeholder="Enter email" 
                />
               {clientErrors && <span style={{color:'red'}}>{clientErrors.email}</span>}
                <br/>

                <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e)=> setFormadata({...formData, password:e.target.value})}
                    placeholder="Enter password"
                /> 
                {clientErrors && <span style={{color:'red'}}>{clientErrors.password}</span>}
                <br/>
              
                <input type="submit"/>
            </form>
        </div>
    )
}

