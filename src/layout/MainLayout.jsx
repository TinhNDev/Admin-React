import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav/TopNav';

const MainLayout = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState !== null ? JSON.parse(savedState) : false;
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return ( 
        <div className='min-h-screen bg-white dark:bg-gray-900'>
            {/* Sidebar */}
            <Sidebar 
                showSidebar={showSidebar} 
                setShowSidebar={setShowSidebar}
                collapsed={collapsed}
                toggleCollapsed={toggleCollapsed}
            />
            
            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${
                collapsed ? 'ml-0 lg:ml-[70px]' : 'ml-0 lg:ml-[260px]'
            }`}>
                {/* Top Navigation */}
                <TopNav 
                    collapsed={collapsed}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    toggleCollapsed={toggleCollapsed}
                />
                
                <div className='pt-[110px] p-4'> 
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
