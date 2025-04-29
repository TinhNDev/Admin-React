import { lazy } from "react";
const Dashboard = lazy(() => import("../../pages/Dashboard"));
const Restaurant = lazy(() => import("../../pages/Restaurant"));
const Shipper = lazy(() => import("../../pages/Shipper"));
const FeedBack = lazy(() => import("../../pages/FeedBack"));
const Coupon = lazy(() => import("../../pages/Coupon"));
const CouponList = lazy(() => import("../../pages/CouponList"));
const DetailRestaurant = lazy(() => import("../../pages/DetailRestaurant"));
const DetailShipper = lazy(() => import("../../pages/DetailShipper"));
const AllOrder = lazy(() => import("../../pages/AllOrder"));
const OrderDetail = lazy(() => import("../../pages/OrderDetail"));
export const adminRoutes = [
  {
    path: "admin/dashboard",
    element: <Dashboard />,
    role: "admin",
  },
  {
    path: "admin/restaurant",
    element: <Restaurant />,
    role: "admin",
  },
  {
    path: "admin/restaurant/:restaurantId",
    element: <DetailRestaurant />,
    role: "admin",
  },
  {
    path: "admin/shipper",
    element: <Shipper />,
    role: "admin",
  },
  {
    path: "admin/shipper/:shipperId",
    element: <DetailShipper />,
    role: "admin",
  },
  {
    path: "admin/feedback",
    element: <FeedBack />,
    role: "admin",
  },
  {
    path: "/admin/coupon",
    element: <CouponList />,
    role: "admin",
  },
  {
    path: "admin/order",
    element: <AllOrder />,
    role: "admin",
  },
  {
    path: "admin/order/:orderId",
    element: <OrderDetail />,
    role: "admin",
  },
];
