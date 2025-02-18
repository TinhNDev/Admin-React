import { AiOutlineDashboard } from "react-icons/ai";
import { PiUsersThreeFill } from "react-icons/pi";

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
        path: '/admin/restaurant'
    },


]