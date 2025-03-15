import { lazy } from "react";         
const Dashboard = lazy(()=> import('../../pages/Dashboard'))
const Restaurant = lazy(()=> import('../../pages/Restaurant'))
const Customer = lazy(()=> import('../../pages/Customer'))
const Shipper = lazy(()=> import('../../pages/Shipper'))
const ProductRequest = lazy(()=> import('../../pages/ProductRequest'))
const FeedBack = lazy(()=> import('../../pages/FeedBack'))
const RestaurantRequest = lazy(()=> import('../../pages/RestaurantRequest'))
const Coupon = lazy(()=> import('../../pages/Coupon'))
const DetailRestaurant = lazy(()=> import('../../pages/DetailRestaurant'))
const DetailShipper = lazy(()=> import('../../pages/DetailShipper'))


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
        path: 'admin/productRequest',
        element : <ProductRequest/>,
        role : 'admin'
    },
    {
        path: 'admin/feedback',
        element : <FeedBack/>,
        role : 'admin'
    },
    {
        path: 'admin/restaurant-request',
        element : <RestaurantRequest/>,
        role : 'admin'
    },
    {
        path: 'admin/coupon',
        element : <Coupon/>,
        role : 'admin'
    },
    {
        path: 'admin/restaurant/details/:restaurantId',
        element : <DetailRestaurant/>,
        role : 'admin'
    },
    {
        path: 'admin/shipper/details/:shipperId',
        element : <DetailShipper/>,
        role : 'admin'
    },
 
]