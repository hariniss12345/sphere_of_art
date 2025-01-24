import AuthContext from "../context/Auth.js"
import {useContext} from 'react'

export default function Profile(){
    const {userState}=useContext(AuthContext)
    // if(!userState){
    //     return <p>loading</p>
    // }

    return (
        <div>
            <h1>profile page</h1>

            <h2>ID-{userState.user._id}</h2>
            <h2>Name-{userState.user.username}</h2>
            <h2>Email-{userState.user.email}</h2>
         
        </div>
    )
}

