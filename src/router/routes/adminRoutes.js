import { lazy } from "react";         
const Dashboard = lazy(()=> import('../../pages/Dashboard'))
const Restaurant = lazy(()=> import('../../pages/Restaurant'))


export const adminRoutes = [
    {
        path: 'admin/dashboard',
        element : <Dashboard/>,
        role : 'admin'
    },
    {
        path: 'admin/restaurant',
        element : <Restaurant/>,
        role : 'admin'
    },
    
 
]