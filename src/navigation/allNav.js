import { AiOutlineDashboard } from "react-icons/ai";
import { IoRestaurant } from "react-icons/io5";
import { MdLocalShipping } from "react-icons/md";
import { FaBowlFood } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";
import { IoMdInformationCircle } from "react-icons/io";
import { MdFastfood } from "react-icons/md";
import { IoIosListBox } from "react-icons/io";

export const allNav = [
  {
    id: 1,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    id: 3,
    title: "Nhà Hàng",
    icon: <IoRestaurant />,
    role: "admin",
    path: "/admin/restaurant",
  },
  {
    id: 4,
    title: "Tài xế",
    icon: <MdLocalShipping />,
    role: "admin",
    path: "/admin/shipper",
  },
  {
    id: 7,
    title: "Mã giảm giá",
    icon: <RiCoupon2Fill />,
    role: "admin",
    path: "/admin/coupon",
  },
  {
    id: 8,
    title: "Đánh giá",
    icon: <MdFeedback />,
    role: "admin",
    path: "/admin/feedback",
  },
  {
    id: 10,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "seller",
    path: "/restaurant/dashboard",
  },
  {
    id: 11,
    title: "Thêm Sản Phẩm",
    icon: <FaBowlFood />,
    role: "seller",
    path: "/restaurant/add-product",
  },
  {
    id: 12,
    title: "Danh sách sản phẩm",
    icon: <MdFastfood />,
    role: "seller",
    path: "/restaurant/products",
  },
  {
    id: 13,
    title: "Danh sách đặt hàng",
    icon: <IoIosListBox />,
    role: "seller",
    path: "/restaurant/order",
  },
  {
    id: 14,
    title: "Thông tin cơ bản",
    icon: <IoMdInformationCircle />,
    role: "seller",
    path: "/restaurant/information",
  },
  {
    id: 15,
    title: "Danh sách đặt hàng",
    icon: <IoIosListBox />,
    role: "admin",
    path: "/admin/order",
  },
];
