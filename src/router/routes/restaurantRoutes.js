import { lazy } from "react";         
const ResDashboard = lazy(()=> import('../../pages/RestaurantDashboard/ResDashboard'))
const ShowProduct = lazy(()=> import('../../pages/RestaurantDashboard/ShowProduct'))
const Product = lazy(()=> import('../../pages/RestaurantDashboard/Product'))
const Infomation = lazy(()=> import('../../pages/RestaurantDashboard/Infomation'))
const Order = lazy(()=> import('../../pages/RestaurantDashboard/Order'))





export const restaurantRoutes = [
    {
        path: 'restaurant/dashboard',
        element : <ResDashboard/>,
        role : 'restaurant'
    },
    {
        path: 'restaurant/products',
        element : <ShowProduct/>,
        role : 'restaurant'
    },
    {
        path: 'restaurant/add-product',
        element : <Product/>,
        role : 'restaurant'
    },
    {
        path: 'restaurant/information',
        element : <Infomation/>,
        role : 'restaurant'
    },
    {
        path: 'restaurant/order',
        element : <Order/>,
        role : 'restaurant'
    },

 
]