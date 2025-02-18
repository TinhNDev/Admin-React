import { lazy } from "react";    
const Login = lazy(()=> import('../../pages/Login')) 

 

const publicRoutes = [
    {
        path : '/login',
        element : <Login/>
    }
]

export default publicRoutes