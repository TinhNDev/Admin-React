import React from 'react';
import './TopNav.scss';
import { Link } from 'react-router-dom';
import user_img from '../../data/avatar.png';
import ThemeMenu from '../../components/thememenu';
import Dropdown from  '../../components/Dropdown'


import notifications from '../../data/JsonData/notification.json' //mock data

const curr_user = {
    display_name: 'Thanh Tinh',
    image: user_img
};

const renderNotificationItem = (item,index) => (
    <div className="notification-item" key={index}>
        <i className={item.icon}></i>
        <span>{item.content}</span>
    </div>
)



function TopNav({ collapsed }) {
    return (
        <div className={`topnav ${collapsed ? 'collapsed' : ''}`}>
            <div className="topnav__right">
                {/* User info hiển thị */}
                <div className="topnav__right-item">
                    <div className="topnav__right-user">
                        <div className="topnav__right-user__image">
                            <img src={curr_user.image} alt="User" />
                        </div>
                        <div className="topnav__right-user__name">
                            {curr_user.display_name}
                        </div>
                    </div>
                </div>
                <div className="topnav__right-item">
                    <Dropdown className="" 
                        icon = "bx bx-bell"
                        badge='5'
                        contentData={notifications}
                        renderItems={(item,index) => renderNotificationItem(item, index)}
                        renderFooter={()=>
                            <Link to="/">View All</Link>
                        }
                     />
                </div>

                {/* Hiển thị ThemeMenu */}
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
        </div>
    );
}

export default TopNav;
