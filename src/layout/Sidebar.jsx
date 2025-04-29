import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import logo from '../data/avatar4.jpg';
import { IoSettings } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import toast from 'react-hot-toast';
import { messageClear } from '../store/reducers/authReducer';
import {  MdPolicy,MdHelpCenter  } from "react-icons/md";


const Sidebar = ({ showSidebar, setShowSidebar, collapsed, toggleCollapsed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const userInfo = useSelector(state => state.auth.userInfo);
    const role = userInfo?.role || "";

    const [allNav, setAllNav] = useState([]);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false); 
    const dashboardLink = role === 'admin' ? '/admin/dashboard' : '/restaurant/dashboard';
    

    useEffect(() => {
        const navs = getNav(role);
        setAllNav(navs);
    }, [role]);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo, navigate]);

    const handleLogout = async () => {
        localStorage.removeItem("userToken");
        navigate("/login");
        toast.success('Logout success');
        dispatch(messageClear());
    };

    return (
        <div>
            <div 
                onClick={() => setShowSidebar(false)} 
                className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[#8cbce780] top-0 left-0 z-10`} 
            /> 

<div className={`${collapsed ? 'w-[70px]' : 'w-[260px]'} fixed bg-white z-50 top-0 h-screen shadow-lg transition-all ${showSidebar ? 'left-0' : collapsed ? '-left-[70px] lg:left-0' : '-left-[260px] lg:left-0'}`}>
    {/* Header */}
    <div className='h-[70px] flex justify-between items-center border-b border-gray-200 px-4'>
        {!collapsed && (
            <Link  to={dashboardLink} className='w-[180px] h-[50px]'>
                <img className='w-full h-full' src={logo} alt="" />
            </Link>
        )}
        <button 
            onClick={toggleCollapsed} 
            className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 ${collapsed ? 'ml-auto' : ''}`}
        >
            {collapsed ? <MdKeyboardArrowRight size={20} /> : <MdKeyboardArrowLeft size={20} />}
        </button>
    </div>

    {/* Main content: Menu + Footer */}
    <div className={`px-[16px] py-[50px] h-[calc(100%-70px)] flex flex-col justify-between ${collapsed ? 'items-center' : ''}`}>
        {/* Menu chính */}
        <ul className={`${collapsed ? 'flex flex-col items-center' : 'w-full'}`}>
            {allNav.map((n, i) => (
                <li key={i} className={collapsed ? 'w-10' : 'w-full'}>
                <Link 
                    to={n.path} 
                    className={`${
                    pathname.startsWith(n.path)
                        ? 'bg-blue-600 shadow-indigo-500/50 text-white duration-500'
                        : 'text-gray-700 hover:bg-gray-100 duration-200'
                    } 
                    text-lg font-bold px-[12px] py-[15px] rounded-lg flex ${collapsed ? 'justify-center' : 'justify-start'} items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                    title={n.title}
                >
                    <span>{n.icon}</span>
                    {!collapsed && <span className="font-bold text-lg">{n.title}</span>}
                </Link>
                </li>
            ))}
            </ul>


        {/* Footer: Setting, Policy, Help, Logout */}
        <div className={`flex flex-col ${collapsed ? 'items-center' : ''} w-full`}>
            <hr className='border-t border-gray-200 my-2 w-full' />
            {/* Nút Setting */}
            <li className={collapsed ? 'w-10' : 'w-full'} style={{ listStyle: 'none' }}>
                <button 
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)} 
                    className={`text-gray-700 hover:bg-gray-100 text-lg font-bold duration-200 px-[12px] py-[15px] rounded-lg flex ${collapsed ? 'justify-center' : 'justify-start'} items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                    title="Setting"
                >
                    <span><IoSettings /></span>
                    {!collapsed && <span className="font-bold text-lg">Cài đặt</span>}
                </button>
                {/* Menu Setting */}
                {showSettingsMenu && (
                    <ul className={`mt-2 ${collapsed ? 'ml-0' : 'ml-4'}`}>
                        <li>
                            <Link
                                to="https://resource.foody.vn/web/security-policy-en.html"
                                className="text-gray-700 hover:bg-gray-100 text-lg font-bold duration-200 px-[12px] py-[10px] rounded-lg flex items-center gap-2"
                            >
                                <MdPolicy size={20} />
                                <span className="font-bold text-lg">Chính sách bảo mật</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="./help-center"
                                className="text-gray-700 hover:bg-gray-100 text-lg font-bold duration-200 px-[12px] py-[10px] rounded-lg flex items-center gap-2"
                            >
                                <MdHelpCenter />
                                <span className="font-bold text-lg">Hỗ trợ</span>
                            </Link>
                        </li>
                    </ul>
                )}
            </li>
            {/* Nút Logout */}
            <li className={collapsed ? 'w-10' : 'w-full'} style={{ listStyle: 'none' }}>
                <button 
                    onClick={handleLogout} 
                    className={`text-gray-700 hover:bg-gray-100 text-lg font-bold duration-200 px-[12px] py-[15px] rounded-lg flex ${collapsed ? 'justify-center' : 'justify-start'} items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                    title="Logout"
                >
                    <span><BiLogOutCircle /></span>
                    {!collapsed && <span className="font-bold text-lg">Đăng xuất</span>}
                </button>
            </li>
        </div>
    </div>
</div>

        </div>
    );
};

export default Sidebar;
