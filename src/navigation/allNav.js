import { AiOutlineDashboard } from "react-icons/ai";
import { PiUsersThreeFill } from "react-icons/pi";
import { IoRestaurant } from "react-icons/io5";
import { MdLocalShipping } from "react-icons/md";
import { FaBowlFood } from "react-icons/fa6";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

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
        id : 5,
        title : 'Product',
        icon : <FaBowlFood />,
        role : 'admin',
        path: '/admin/product'
    },
    {
        id : 6,
        title : 'LiveChat',
        icon : <IoChatbubbleEllipsesSharp />,
        role : 'admin',
        path: '/admin/live-chat'
    },



]