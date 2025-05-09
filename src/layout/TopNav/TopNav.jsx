import React, { useEffect } from "react";
import "./TopNav.scss";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useDispatch, useSelector } from "react-redux";
import { fetch_feedbacks } from "../../store/reducers/feedbackReducer";
import user_img from "../../data/admin.png";
import ThemeMenu from "../../components/thememenu";
import Dropdown from "../../components/Dropdown";

const curr_user = {
  display_name: "Admin",
  image: user_img,
};

const TopNav = ({ collapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Thêm hook navigate
  const { feedbacks, loader, errorMessage } = useSelector(
    (state) => state.feedback
  );

  useEffect(() => {
    dispatch(fetch_feedbacks());
  }, [dispatch]);

  const displayedFeedbacks = feedbacks.slice(-5).reverse();
  const checkedFeedbacksCount = feedbacks.filter(item => !item.is_checked).length;

  // Thêm handle click để chuyển trang
  const handleNotificationClick = (feedbackId) => {
    navigate(`/admin/feedback/${feedbackId}`);
  };

  // Sửa lại render function để thêm onClick
  const renderNotificationItem = (item, index) => (
    <div
      className={`notification-item${item.is_checked ? " notification-item--checked" : ""}`}
      key={item.id || index}
      onClick={() => handleNotificationClick(item.id)} // Thêm sự kiện click
      style={{ cursor: "pointer" }} // Thêm hiệu ứng cursor
    >
      <div className="notification-item__avatar">
        <i className="bx bx-user"></i>
      </div>
      <div className="notification-item__info">
        <div className="notification-item__header">
          <span className="notification-item__name">{item.name}</span>
        </div>
        <div className="notification-item__content">
          {item.content}
          {item.order && (
            <div className="notification-item__order">
              <span>Đơn hàng #{item.order.id}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`topnav ${collapsed ? "collapsed" : ""}`}>
      <div className="topnav__right">
        {/* User info */}
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

        {/* Notifications */}
        <div className="topnav__right-item">
          {loader ? (
            <div>Loading...</div>
          ) : errorMessage ? (
            <div>Error: {errorMessage}</div>
          ) : (
            <Dropdown
              className=""
              icon="bx bx-bell"
              badge={checkedFeedbacksCount.toString()}
              contentData={displayedFeedbacks}
              renderItems={(item, index) => renderNotificationItem(item, index)}
              renderFooter={() => (
                <Link to="/admin/feedback">Xem tất cả ({feedbacks.length})</Link>
              )}
            />
          )}
        </div>

        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
