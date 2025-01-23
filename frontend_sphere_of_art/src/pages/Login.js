import { useState } from "react"

export default function Login(){
  
    const [formData, setFormadata] = useState({
        username:"",
        email : "",
        password : ""
    });


    return(
        <div className="login">
            <h2>Login page</h2>
           
            <form>
            <input 
                    type="text" 
                    value={formData.username} 
                    onChange={(e)=> setFormadata({...formData, username:e.target.value})}
                    placeholder="Enter username" 
                />
                
                <br/>
                <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e)=> setFormadata({...formData, email:e.target.value})}
                    placeholder="Enter email" 
                />
              
                <br/>

                <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e)=> setFormadata({...formData, password:e.target.value})}
                    placeholder="Enter password"
                />               
                <br/>
              
                <input type="submit"/>
            </form>
        </div>
    )
}

