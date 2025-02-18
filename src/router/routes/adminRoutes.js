import { lazy } from "react";         
const Dashboard = lazy(()=> import('../../pages/Dashboard'))
const Restaurant = lazy(()=> import('../../pages/Restaurant'))
const Customer = lazy(()=> import('../../pages/Customer'))
const Shipper = lazy(()=> import('../../pages/Shipper'))
const Product = lazy(()=> import('../../pages/Product'))
const LiveChat = lazy(()=> import('../../pages/LiveChat'))


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
    {
        path: 'admin/customer',
        element : <Customer/>,
        role : 'admin'
    },
    {
        path: 'admin/shipper',
        element : <Shipper/>,
        role : 'admin'
    },
    {
        path: 'admin/product',
        element : <Product/>,
        role : 'admin'
    },
    {
        path: 'admin/live-chat',
        element : <LiveChat/>,
        role : 'admin'
    },
    
 
]