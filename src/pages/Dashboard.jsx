import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { get_allOrder } from "../store/reducers/orderReducer";
import { get_allRestaurant } from "../store/reducers/restaurantReducer";
import { get_allDriver } from "../store/reducers/driverReducer";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateDailyRevenue,
  formatCurrency,
  getMonthlyRevenueArray,
} from "../utils/utils";

// Số lượng người truy cập từng ngày trong từng tháng
const dailyVisitorsByMonth = {
  0: Array.from({ length: 31 }, () => Math.floor(Math.random() * 101)), // Tháng 1
  1: Array.from({ length: 28 }, () => Math.floor(Math.random() * 101)), // Tháng 2
  2: Array.from({ length: 31 }, () => Math.floor(Math.random() * 101)), // Tháng 3
  3: Array.from({ length: 30 }, () => Math.floor(Math.random() * 101)), // Tháng 4
  4: Array.from({ length: 31 }, () => Math.floor(Math.random() * 101)), // Tháng 5
  5: Array.from({ length: 30 }, () => Math.floor(Math.random() * 101)), // Tháng 6
  6: Array.from({ length: 31 }, () => Math.floor(Math.random() * 101)), // Tháng 7
  7: Array.from({ length: 31 }, () => Math.floor(Math.random() * 101)), // Tháng 8
  8: Array.from({ length: 30 }, () => Math.floor(Math.random() * 101)), // Tháng 9
  9: Array.from({ length: 31 }, () => Math.floor(Math.random() * 101)), // Tháng 10
  10: Array.from({ length: 30 }, () => Math.floor(Math.random() * 101)), // Tháng 11
  11: Array.from({ length: 31 }, () => Math.floor(Math.random() * 101)), // Tháng 12
};


// Số lượng người truy cập theo tháng
const monthlyVisitors = Array.from({ length: 12 }, () => Math.floor(Math.random() * 101));



const Dashboard = () => {
  const dispatch = useDispatch();
    const [currentPage] = useState(1);
    const [parPage] = useState(5);
    const [sortField] = useState("");
    const [sortOrder] = useState("asc");

  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  const { totalRestaurant = 0 } = useSelector(
    (state) => state.restaurant || {}
  );
  const { totalDrivers = 0 } = useSelector((state) => state.driver || {});
  const { orders = [], totalOrders = 0 } = useSelector(
    (state) => state.order || {}
  );
  const monthlyRevenueData = getMonthlyRevenueArray(orders);

  // Extract data for chart
  const monthLabels = monthlyRevenueData.map((item) => item.shortMonth);
  const revenueValues = monthlyRevenueData.map((item) => item.revenue);

  // Biểu đồ doanh thu
  const [view, setView] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);

  useEffect(() => {
    if (selectedMonth !== null) {
      const selectedMonthData = monthlyRevenueData[selectedMonth];
      if (selectedMonthData) {
        const monthIndex = new Date(
          Date.parse(`${selectedMonthData.month} 1, ${selectedMonthData.year}`)
        ).getMonth();
        const year = selectedMonthData.year;
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const monthOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === monthIndex &&
            orderDate.getFullYear() === year
          );
        });
        const dailyRevenue = {};
        monthOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          const day = orderDate.getDate();
          dailyRevenue[day] =
            (dailyRevenue[day] || 0) + parseFloat(order.price || 0);
        });
        const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          return {
            day: `Ngày ${day}`,
            value: dailyRevenue[day] || 0,
          };
        });

        setDailyRevenueData(dailyData);
      }
    }
  }, [selectedMonth, monthlyRevenueData, orders]);

  // Chart options cho doanh thu theo tháng
  const monthChartOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "'Roboto', sans-serif",
      events: {
        dataPointSelection: function (event, chartContext, config) {
          setSelectedMonth(config.dataPointIndex);
          setView("day");
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "65%",
        distributed: false
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.85,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
          value: 0.85,
        },
      },
    },
    xaxis: {
      categories: monthLabels,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "'Roboto', sans-serif",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Doanh thu (VND)",
          style: {
            fontSize: "13px",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: function (val) {
            return val.toLocaleString() + " đ";
          },
          style: {
            fontSize: "12px",
          },
        },
      },
      {
        opposite: true, // Hiển thị bên phải
        title: {
          text: "Số lượng truy cập",
          style: {
            fontSize: "13px",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: function (val) {
            return val.toLocaleString();
          },
          style: {
            fontSize: "12px",
          },
        },
      },
    ],
    colors: ["#4F46E5", "#22c55e"], // Thêm màu cho cột thứ 2
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: function (val) {
            return `${val?.toLocaleString() ?? '0'} VND`; // Xử lý undefined
          },
        },
        {
          formatter: function (val) {
            return `${val?.toLocaleString() ?? '0'} lượt`; // Xử lý undefined
          },
        },
      ],
      theme: themeReducer === "theme-mode-dark" ? "dark" : "light",
    },
  };
  // Chart options cho doanh thu theo ngày
  const dayChartOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "'Roboto', sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: dailyRevenueData.map((item) => item.day),
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "'Roboto', sans-serif",
        },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Doanh thu (VND)",
          style: {
            fontSize: "13px",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: function (val) {
            return val.toLocaleString() + " đ";
          },
          style: {
            fontSize: "12px",
          },
        },
      },
      {
        opposite: true, // Hiển thị bên phải
        title: {
          text: "Số lượng truy cập",
          style: {
            fontSize: "13px",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: function (val) {
            return val.toLocaleString();
          },
          style: {
            fontSize: "12px",
          },
        },
      },
    ],
    colors: ["#f59e0b", "#22c55e"], 
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: function (val) {
            return `${val.toLocaleString()} VND`;
          },
        },
        {
          formatter: function (val) {
            return `${val.toLocaleString()} lượt`;
          },
        },
      ],
      theme: themeReducer === "theme-mode-dark" ? "dark" : "light",
    },
  };

  useEffect(() => {
    dispatch(get_allOrder());
  }, [dispatch]);
  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      sortField,
      sortOrder,
    };
    dispatch(get_allRestaurant(obj));
  },[parPage, currentPage, sortField, sortOrder, dispatch]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      sortField,
      sortOrder,
    };
    dispatch(get_allDriver(obj));
  },[parPage, currentPage, sortField, sortOrder, dispatch]);

  const topOrders = orders.slice(0, 5);
  const getRevenue = calculateDailyRevenue(orders);
  const statusCards = [
    {
      icon: "bx bx-shopping-bag",
      count: formatCurrency(getRevenue.totalRevenue),
      title: "Doanh thu hôm nay",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      icon: "bx bx-home",
      count: totalRestaurant,
      title: "Tổng nhà hàng",
      color: "text-green-500",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      path: "/admin/restaurant", 
    },
    {
      icon: "bx bx-user",
      count: totalDrivers,
      title: "Tổng shipper",
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200",
      path: "/admin/shipper", // Thêm path
    },
    {
      icon: "bx bx-receipt",
      count: totalOrders,
      title: "Tổng đơn hàng",
      color: "text-rose-500",
      bgColor: "bg-rose-100",
      borderColor: "border-rose-200",
      path: "/admin/order", // Thêm path
    },
  ];
  
  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
        return "Đơn hàng mới";
      case "PREPARING_ORDER":
        return "Đang chuẩn bị";
      case "ORDER_CANCELED":
        return "Đơn bị hủy";
      case "ORDER_RECEIVED":
        return "Đã giao cho shipper";
      case "DELIVERING":
        return "Shipper đang lấy đơn";
      case "ORDER_CONFIRMED":
        return "Đã giao xong";
      case "UNPAID":
        return "Chưa thanh toán";
      default:
        return "Không xác định";
    }
  };
  // Hàm lấy trạng thái class dựa trên order_status
  const getStatusClassName = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "UNPAID":
        return "bg-red-100 text-red-800";
      case "PREPARING_ORDER":
        return "bg-blue-100 text-blue-800";
      case "ORDER_CANCELED":
        return "bg-red-100 text-red-800";
      case "ORDER_RECEIVED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERING":
        return "bg-yellow-100 text-yellow-800";
      case "ORDER_CONFIRMED":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      </div>
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statusCards.map((item, index) => {
            // Thêm path cho các card cần chuyển trang
            const cardWithLink = item.path ? (
              <Link 
                key={index}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className={`bg-white rounded-lg shadow-sm border ${item.borderColor} overflow-hidden transition-all duration-300 hover:shadow-md`}
                >
                  {/* Nội dung card giữ nguyên */}
                  <div className={`${item.bgColor} px-4 py-2`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-700">{item.title}</h3>
                      <i className={`${item.icon} text-xl ${item.color}`}></i>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-2xl font-bold text-gray-800">
                      {item.count}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              // Card không có chức năng click
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm border ${item.borderColor} overflow-hidden transition-all duration-300 hover:shadow-md`}
              >
                {/* Nội dung card giữ nguyên */}
                <div className={`${item.bgColor} px-4 py-2`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700">{item.title}</h3>
                    <i className={`${item.icon} text-xl ${item.color}`}></i>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-2xl font-bold text-gray-800">
                    {item.count}
                  </div>
                </div>
              </div>
            );

            return cardWithLink;
          })}
        </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Biểu đồ doanh thu
            </h3>
          </div>
          <div className="p-5">
            {view === "month" && (
              <div>
                <div className="flex gap-4 mb-4">
                  <button
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled
                  >
                    Theo tháng
                  </button>
                </div>
                <Chart
                  options={monthChartOptions}
                  series={[
                    { name: "Doanh thu", data: revenueValues, type: "column" },
                    { name: "Số lượng truy cập", data: monthlyVisitors, type: "column" },
                  ]}
                  type="bar"
                  height={320}
                />
                <p className="text-sm text-gray-500 mt-4 text-center">
                  * Bấm vào cột tháng để xem chi tiết doanh thu từng ngày
                </p>
              </div>
            )}

            {view === "day" && selectedMonth !== null && (
              <div>
                <div className="flex justify-between items-center mb-4">
                <button
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center"
                  onClick={() => {
                    setView("month");
                    setSelectedMonth(null); 
                  }}
                >
                  <i className="bx bx-arrow-back mr-1"></i>
                  Quay lại
                </button>
                  <h4 className="text-lg font-medium text-gray-700">
                    {monthlyRevenueData[selectedMonth]?.month}{" "}
                    {monthlyRevenueData[selectedMonth]?.year}
                  </h4>
                </div>

                {dailyRevenueData.length > 0 ? (
                  <Chart
                    options={dayChartOptions}
                    series={[
                      {
                        name: `Doanh thu ${monthlyRevenueData[selectedMonth]?.month}`,
                        data: dailyRevenueData.map((item) => item.value),
                        type: "area",
                      },
                      {
                        name: "Số lượng truy cập",
                        data: dailyVisitorsByMonth[selectedMonth] || [],
                        type: "area",
                      },
                    ]}
                    type="area"
                    height={320}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-80">
                    <i className="bx bx-line-chart text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-500">
                      Không có dữ liệu doanh thu cho tháng này
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Đơn hàng gần đây
            </h3>
            <Link
              to="/admin/order"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Xem tất cả
              <i className="bx bx-chevron-right ml-1"></i>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Người nhận
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giá trị
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Liên hệ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topOrders.length > 0 ? (
                  topOrders.map((order, idx) => (
                    <tr
                      key={order.id || idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{idx + 1}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.receiver_name}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(
                            order.order_status
                          )}`}
                        >
                          {getStatusText(order.order_status) || "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                        {parseInt(order.price).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <i className="bx bx-phone mr-2 text-gray-500"></i>
                          {order.phone_number}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <i className="bx bx-package text-3xl text-gray-300 mb-2"></i>
                        <span className="text-gray-500">
                          Không có dữ liệu đơn hàng
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {topOrders.length > 0 && (
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
              Hiển thị {topOrders.length} trong tổng số {totalOrders} đơn hàng
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
