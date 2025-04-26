import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import TopNav from './TopNav/TopNav';
import ThemeAction from '../actions/ThemeAction';

const MainLayout = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState !== null ? JSON.parse(savedState) : false;
    });

    const themeReducer = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    useEffect(() => {
        const colorClass = localStorage.getItem('colorMode') || 'blue';
        dispatch(ThemeAction.setColor(colorClass));
    }, [dispatch]);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`min-h-screen ${themeReducer.mode} ${themeReducer.color}`}>
            <Sidebar 
                showSidebar={showSidebar} 
                setShowSidebar={setShowSidebar}
                collapsed={collapsed}
                toggleCollapsed={toggleCollapsed}
            />
            
            <div className={`layout__content ${
                collapsed ? 'ml-0 lg:ml-[70px]' : 'ml-0 lg:ml-[260px]'
            }  transition-all duration-300`}>
                <TopNav 
                    collapsed={collapsed}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    toggleCollapsed={toggleCollapsed}
                />
                
                <div className="layout__content-main px-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
