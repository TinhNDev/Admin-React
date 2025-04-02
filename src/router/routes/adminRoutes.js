import { lazy } from "react";         
const Dashboard = lazy(()=> import('../../pages/Dashboard'))
const Restaurant = lazy(()=> import('../../pages/Restaurant'))
const Shipper = lazy(()=> import('../../pages/Shipper'))
const FeedBack = lazy(()=> import('../../pages/FeedBack'))
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
        role : 'admin',
        children: [
            {
                path: 'details/:restaurantId',
                element: <DetailRestaurant/>,
                role: 'admin'
            }
        ]
    },
    {
        path: 'admin/shipper',
        element : <Shipper/>,
        role : 'admin',
        children: [
            {
                path: 'details/:shipperId',
                element: <DetailShipper/>,
                role: 'admin'
            }
        ]
    },
    {
        path: 'admin/feedback',
        element : <FeedBack/>,
        role : 'admin'
    },
    {
        path: 'admin/coupon',
        element : <Coupon/>,
        role : 'admin'
    }
]
