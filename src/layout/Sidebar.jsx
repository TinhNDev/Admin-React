import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import logo from '../data/avatar4.jpg';
import { IoSettings } from "react-icons/io5";
import { logout } from '../store/reducers/authReducer';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    // Kiểm tra userInfo trước khi truy cập role
    const userInfo = useSelector(state => state.auth.userInfo);
    const role = userInfo?.role || "";  // Nếu không có role, trả về ""

    const [allNav, setAllNav] = useState([]);

    useEffect(() => {
        const navs = getNav(role);
        setAllNav(navs);
    }, [role]);

    // Điều hướng về login nếu userInfo bị null (sau khi logout)
    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo, navigate]);

    const handleLogout = async () => {
        await dispatch(logout());
        localStorage.removeItem("userToken");  // Xóa token khi logout
        navigate("/login");  // Chuyển hướng về trang login
    };

    return (
        <div>
            <div 
                onClick={() => setShowSidebar(false)} 
                className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[#8cbce780] top-0 left-0 z-10`} 
            /> 

            <div className={`w-[260px] fixed bg-[#eb5d50] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${showSidebar ? 'left-0' : '-left-[260px] lg:left-0'}`}>
                <div className='h-[70px] flex justify-center items-center'>
                    <Link to='/' className='w-[180px] h-[50px]'>
                        <img className='w-full h-full' src={logo} alt="" />
                    </Link> 
                </div>

                <div className='px-[16px] py-[50px]'>
                    <ul>
                        {allNav.map((n, i) => (
                            <li key={i}>
                                <Link 
                                    to={n.path} 
                                    className={`${pathname === n.path 
                                        ? 'bg-blue-600 shadow-indigo-500/50 text-white duration-500' 
                                        : 'text-[#030811] duration-200'} 
                                        text-lg px-[12px] py-[15px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                                >
                                    <span>{n.icon}</span>
                                    <span>{n.title}</span>
                                </Link>
                            </li>
                        ))}
                        <div className='mt-auto flex flex-col h-[calc(100%-70px)]'>
                            <hr className='border-t border-gray-300 my-2' />
                            <li>
                                <button className='text-[#030811] text-lg duration-200 px-[12px] py-[15px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1'>
                                    <span><IoSettings /></span>
                                    <span>Setting</span>
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout} 
                                    className='text-[#030811] text-lg duration-200 px-[12px] py-[15px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1'
                                >
                                    <span><BiLogOutCircle /></span>
                                    <span>Logout</span>
                                </button>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
