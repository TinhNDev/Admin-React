import { AiOutlineDashboard } from "react-icons/ai";
import { PiUsersThreeFill } from "react-icons/pi";
import { IoRestaurant } from "react-icons/io5";
import { MdLocalShipping } from "react-icons/md";
import { FaBowlFood } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";
import { IoMdInformationCircle } from "react-icons/io";
import { MdFastfood } from "react-icons/md";

export const allNav = [
    {
        id : 1,
        title : 'Dashboard',
        icon : <AiOutlineDashboard />,
        role : 'admin',
        path: '/admin/dashboard'
    },
    {
        id : 2,
        title : 'Customers',
        icon : <PiUsersThreeFill />,
        role : 'admin',
        path: '/admin/customer'
    },
    {
        id : 3,
        title : 'Restaurant',
        icon : <IoRestaurant />,
        role : 'admin',
        path: '/admin/restaurant'
    },
    {
        id : 4,
        title : 'Shipper',
        icon : <MdLocalShipping />,
        role : 'admin',
        path: '/admin/shipper'
    },
    {
        id : 7,
        title : 'Coupon',
        icon : <RiCoupon2Fill />,
        role : 'admin',
        path: '/admin/coupon'
    },
    {
        id : 8,
        title : 'FeedBack',
        icon : <MdFeedback />,
        role : 'admin',
        path: '/admin/feedback'
    },
    {
        id : 10,
        title : 'Dashboard',
        icon : <AiOutlineDashboard />,
        role : 'seller',
        path: '/restaurant/dashboard'
    },
    {
        id : 11,
        title : 'Add Product',
        icon : <FaBowlFood />,
        role : 'seller',
        path: '/restaurant/add-product'
    },
    {
        id : 12,
        title : 'Products',
        icon : <MdFastfood />,
        role : 'seller',
        path: '/restaurant/products'
    },
    {
        id : 13,
        title : 'Information',
        icon : <IoMdInformationCircle />,
        role : 'seller',
        path: '/restaurant/information'
    },



]