import AuthContext from '../context/Auth.js'
import {useReducer,useEffect} from 'react'

const initialState={
    isLoggedIn:false,
    user:null
}

export default function AuthProvider(props){
    const[ userState,userDispatch]=useReducer(userReducer,initialState)


    return (
        <div>
            <AuthContext.Provider >
                {props.children}
            </AuthContext.Provider>     
        </div>
    )
}
