import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Sidebar from './Sidebar';

const MainLayout = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    
    // Khởi tạo state collapsed từ localStorage
    const [collapsed, setCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState !== null ? JSON.parse(savedState) : false;
    });

    // Lưu trạng thái collapsed vào localStorage khi thay đổi
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    // Hàm để toggle trạng thái collapsed
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return ( 
        <div className='bg-[#00000] w-full min-h-screen'>
            <Header 
                showSidebar={showSidebar} 
                setShowSidebar={setShowSidebar}
                collapsed={collapsed}
            />
            <Sidebar 
                showSidebar={showSidebar} 
                setShowSidebar={setShowSidebar}
                collapsed={collapsed}
                toggleCollapsed={toggleCollapsed}
            />

            <div 
                className={`${collapsed ? 'ml-0 lg:ml-[70px]' : 'ml-0 lg:ml-[260px]'} pt-[95px] transition-all duration-300`}
            >
                <Outlet/>
            </div>
        </div>
    );
};

export default MainLayout;
