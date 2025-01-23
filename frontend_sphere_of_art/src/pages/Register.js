import '../App.css';
import { useState } from "react"

export default function Register(){
    
    const [formData, setFormdata] = useState({
        username:"",
        email : "",
        password : "",
        role : ""
    });


    return(
        <>
            <h2>Register page</h2>
            <form >
            <input 
                    type="text" 
                    value={formData.username} 
                    onChange={(e)=> setFormdata({...formData, username:e.target.value})}
                    placeholder="Enter username" 
                /><br/>
            
                <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e)=> setFormdata({...formData, email:e.target.value})}
                    placeholder="Enter email" 
                /><br/>
                
                <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e)=> setFormdata({...formData, password:e.target.value})}
                    placeholder="Enter password"
                /> <br />
                
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
               
                <input type="submit" value="sign up"/>
            </form>
        </>
    )
}

