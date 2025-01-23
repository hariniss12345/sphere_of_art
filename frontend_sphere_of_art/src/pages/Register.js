import '../App.css';
import { useState } from "react"

import axios from 'axios'; 
export default function Register(){
    
    const [formData, setFormdata] = useState({
        username:"",
        email : "",
        password : "",
        role : ""
    });
    const [clientErrors, setClientErros] = useState(null);
  
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

        if(formData.role.trim().length === 0){
            clientValidationsErrors.role = 'role is required'
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        runClientValidations();
        console.log(clientValidationsErrors); 
        if(Object.keys(clientValidationsErrors).length == 0) {
            try {
                const response = await axios.post('http://localhost:4700/api/users/register', formData)  
                console.log(response.data)
            } catch(err) {
               console.log(err.message)
            }
            setClientErros({})
        } else {
            setClientErros(clientValidationsErrors); 
        }
    }

    return(
        <>
            <h2>Register page</h2>
           
            <form onSubmit={handleSubmit}>
            <input 
                    type="text" 
                    value={formData.username} 
                    onChange={(e)=> setFormdata({...formData, username:e.target.value})}
                    placeholder="Enter username" 
                /><br/>
                {clientErrors && <p className="clientErrors">{clientErrors.username}</p>}

                <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e)=> setFormdata({...formData, email:e.target.value})}
                    placeholder="Enter email" 
                /><br/>
                {clientErrors && <p className="clientErrors">{clientErrors.email}</p>}


                <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e)=> setFormdata({...formData, password:e.target.value})}
                    placeholder="Enter password"
                /> <br />
                {clientErrors && <p className="clientErrors">{clientErrors.password}</p>}

                <input 
                    type="radio" 
                    name="role"  
                    value="customer"
                    id="customer" 
                    onChange={(e)=> setFormdata({...formData, role:e.target.value})} 
                /><label htmlFor="customer" name="customer">Customer</label>

                <input 
                    type="radio" 
                    name="role" 
                    value="artist" 
                    id="artist"
                    onChange={(e)=> setFormdata({...formData, role:e.target.value})} 
                />
                <label htmlFor="artist" name="artist">Artist</label><br />
                {clientErrors && <p className="clientErrors">{clientErrors.role}</p>}

                <input type="submit" value="sign up"/>
            </form>
        </>
    )
}

