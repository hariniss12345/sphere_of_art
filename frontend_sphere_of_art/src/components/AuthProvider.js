import AuthContext from '../context/Auth.js'
import {useReducer,useEffect} from 'react'
import userReducer from '../reducers/userReducer.js'
import axios from 'axios'

const initialState={
    isLoggedIn:false,
    user:null
}

export default function AuthProvider(props){
    const[ userState,userDispatch]=useReducer(userReducer,initialState)

    const handleLogin=(user)=>{
        return userDispatch({type:'LOGIN',payload:{isLoggedIn:true,user:user}})
    }
    
    const handelLogout=()=>{
        return userDispatch({type:'LOGOUT',payload:{isLoggedIn:false,user:null}})
    }

    // useEffect(()=>{
    //     (async ()=>{
    //         if(localStorage.getItem('token')){
    //             const response=await axios.get('http://localhost:4700/api/users/profile',{headers:{Authorization:localStorage.getItem('token')}})
    //             handleLogin(response.data)
    //         }
    //     })();
    // },[])     

    // //to handle page loads
    // if(localStorage.getItem('token')&& !userState.user){
    //     return <p>loading...</p>
    // }

    return (
        <div>
            <AuthContext.Provider value={{userState,handleLogin,handelLogout}}>
                {props.children}
            </AuthContext.Provider>     
        </div>
    )
}
