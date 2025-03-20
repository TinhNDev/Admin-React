import { lazy } from "react";    
const Login = lazy(()=> import('../../pages/Login')) 
const Register = lazy(()=> import('../../pages/RestaurantDashboard/Register')) 

 

const publicRoutes = [
    {
        path : '/login',
        element : <Login/>
    },
    {
        path : '/register',
        element : <Register/>
    }
]

export default publicRoutes