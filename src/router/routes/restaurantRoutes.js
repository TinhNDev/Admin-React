import { lazy } from "react";         
const ResDashboard = lazy(()=> import('../../pages/RestaurantDashboard/ResDashboard'))
const LiveChat = lazy(()=> import('../../pages/RestaurantDashboard/LiveChat'))
const Product = lazy(()=> import('../../pages/RestaurantDashboard/Product'))
const Infomation = lazy(()=> import('../../pages/RestaurantDashboard/Infomation'))





export const adminRoutes = [
    {
        path: 'restaurant/dashboard',
        element : <ResDashboard/>,
        role : 'restaurant'
    },
    {
        path: 'restaurant/live-chat',
        element : <LiveChat/>,
        role : 'restaurant'
    },
    {
        path: 'restaurant/product',
        element : <Product/>,
        role : 'restaurant'
    },
    {
        path: 'restaurant/information',
        element : <Infomation/>,
        role : 'restaurant'
    },

 
]