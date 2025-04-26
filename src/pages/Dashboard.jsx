import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import StatusCard from '../components/status-card'
import { get_allRestaurant } from '../store/reducers/restaurantReducer';
import { get_allDriver } from '../store/reducers/driverReducer';
import { get_allOrder } from "../store/reducers/orderReducer";
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// Tạo dữ liệu mẫu doanh thu theo ngày cho từng tháng
const dailyRevenueByMonth = {
  0: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 1
  1: Array.from({ length: 28 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 2
  2: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 3
  3: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 4
  4: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 5
  5: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 6
  6: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 7
  7: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 8
  8: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 9
  9: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 10
  10: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 11
  11: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000) + 500), // Tháng 12
};

const monthLabels = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];
const monthlyRevenue = [
  15000, 18000, 21000, 24000, 20000, 23000, 26000, 28000, 30000, 32000, 29000, 35000
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const themeReducer = useSelector(state => state.ThemeReducer.mode)
  const restaurantState = useSelector((state) => state.restaurant || {});
  const { restaurants, totalRestaurant } = restaurantState;
  const driverState = useSelector((state) => state.driver || {});
  const { drivers, totalDrivers } = driverState;
  const orderState = useSelector((state) => state.order || {});
  const { orders, totalOrders } = orderState;

  // --- Biểu đồ doanh thu ---
  const [view, setView] = useState('month'); // 'month' hoặc 'day'
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Chart options cho doanh thu theo tháng
  const monthChartOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: true },
      events: {
        dataPointSelection: function(event, chartContext, config) {
          setSelectedMonth(config.dataPointIndex);
          setView('day');
        }
      }
    },
    xaxis: {
      categories: monthLabels,
      title: { text: 'Doanh thu theo Tháng' },
      labels: {
        offsetY: 8 // hoặc giá trị lớn hơn nếu cần
      }
      
    },
    yaxis: {
      title: { text: 'Doanh thu (VND)' }
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: function(val) { return `${val.toLocaleString()} VND`; }
      }
    }
  };

  // Chart options cho doanh thu theo ngày của một tháng
  const dayChartOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: true } },
    xaxis: {
      categories: selectedMonth !== null
        ? Array.from({ length: dailyRevenueByMonth[selectedMonth].length }, (_, i) => `Ngày ${i + 1}`)
        : [],
      title: { text: selectedMonth !== null ? `Doanh thu của ${monthLabels[selectedMonth]}` : '' }
    },
    yaxis: {
      title: { text: 'Doanh thu (VND)' }
    },
    colors: ['#f59e42'],
    tooltip: {
      y: {
        formatter: function(val) { return `${val.toLocaleString()} VND`; }
      }
    }
  };

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      search: searchValue,
      sortField,
      sortOrder
    };
    dispatch(get_allRestaurant(obj));
  }, [searchValue, currentPage, parPage, sortField, sortOrder]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      search: searchValue,
      sortField,
      sortOrder
    };
    dispatch(get_allDriver(obj));
  }, [searchValue, currentPage, parPage, sortField, sortOrder]);

  useEffect(() => {
    dispatch(get_allOrder());
  }, []);

  const topRestaurants = restaurants.slice(0, 5);
  const topDrivers = drivers.slice(0, 5);
  const topOrders = orders.slice(0, 5);

  const statusCards = [
    {
      "icon": "bx bx-shopping-bag",
      "count": "1,995",
      "title": "Total sales"
    },
    {
      icon: "bx bx-home",
      count: totalRestaurant ?? 0,
      title: "Tổng nhà hàng"
    },
    {
      icon: "bx bx-user",
      count: totalDrivers ?? 0,
      title: "Tổng shipper"
    },
    {
      icon: "bx bx-receipt",
      count: totalOrders ?? 0,
      title: "Tổng đơn hàng"
    }
  ]

  return (
    <div>
      <h2 className="page-header text-2xl font-bold">
        Dashboard
      </h2>
      <div className="row">
        <div className="col-6">
          <div className="row">
            {statusCards.map((item, index) => (
              <div className="col-6" key={index}>
                <StatusCard
                  icon={item.icon}
                  count={item.count}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-6 flex items-stretch">
          <div className='w-full flex'>
            <div className='w-full'>
              <div className=' bg-[#e5e4eb] p-4 rounded-md'>
                {view === 'month' && (
                  <div>
                    <div className="flex gap-4 mb-4">
                      <button
                        className="px-4 py-2 rounded bg-blue-500 text-white"
                        disabled
                      >
                        Theo tháng
                      </button>
                    </div>
                    <Chart
                      options={monthChartOptions}
                      series={[{ name: 'Doanh thu', data: monthlyRevenue }]}
                      type="bar"
                      height={300}
                    />
                    <p className="text-sm text-gray-500">
                      * Bấm vào cột tháng để xem chi tiết doanh thu từng ngày
                    </p>
                  </div>
                )}
                {view === 'day' && selectedMonth !== null && (
                  <div>
                    <button
                      className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setView('month')}
                    >
                      ← Quay lại
                    </button>
                    <Chart
                      options={dayChartOptions}
                      series={[{ name: `Doanh thu ${monthLabels[selectedMonth]}`, data: dailyRevenueByMonth[selectedMonth] }]}
                      type="bar"
                      height={320}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
              <div className="col-3">
                    <div className="card">
                        <div className="card__header px-4 py-3 border-b border-gray-200">
                        <h3 className='text-lg font-bold text-gray-700'>Nhà Hàng</h3>
                        </div>
                        <div className="card__body p-4">
                        <table className="w-full text-base table-fixed">
                            <colgroup>
                            <col className="w-1/6" />
                            <col className="w-2/5" />
                            <col className="w-2/5" />
                            </colgroup>
                            <thead>
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold">ID</th>
                                <th className="px-3 py-2 text-left font-semibold">Tên</th>
                                <th className="px-3 py-2 text-left font-semibold">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {topRestaurants.map((res, idx) => (
                                <tr key={res.id || idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2">{idx + 1}</td>
                                <td className="px-3 py-2">{res.name}</td>
                                <td className="px-3 py-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    res.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : res.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {res.status || 'N/A'}
                                    </span>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {topRestaurants.length === 0 && (
                            <div className="text-gray-500 text-center py-2">Không có dữ liệu</div>
                        )}
                        </div>
                        <div className="card__footer px-4 py-3 border-t border-gray-200">
                        <Link to='/admin/restaurant' className="text-blue-600 hover:underline">
                            View All!
                        </Link>
                        </div>
                    </div>
                </div>
              <div className="col-3">
                  <div className="card">
                      <div className="card__header">
                          <h3 className='text-xl font-bold'>Tài xế</h3>
                      </div>
                      <div className="card__body p-4">
                        <table className="w-full text-base table-fixed">
                            <colgroup>
                            <col className="w-1/6" />
                            <col className="w-2/5" />
                            <col className="w-2/5" />
                            </colgroup>
                            <thead>
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold">ID</th>
                                <th className="px-3 py-2 text-left font-semibold">Tên</th>
                                <th className="px-3 py-2 text-left font-semibold">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {topDrivers.map((dri, idx) => (
                                <tr key={dri.id || idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2">{idx + 1}</td>
                                <td className="px-3 py-2">{dri.Profile.name}</td>
                                <td className="px-3 py-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        dri.status === 'BUSY'
                                        ? 'bg-green-100 text-green-800'
                                        : dri.status === 'PROCESSING'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : dri.status === 'ONLINE'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                        {dri.status || 'N/A'}
                                    </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {topRestaurants.length === 0 && (
                            <div className="text-gray-500 text-center py-2">Không có dữ liệu</div>
                        )}
                        </div>
                        <div className="card__footer px-4 py-3 border-t border-gray-200">
                        <Link to='/admin/shipper' className="text-blue-600 hover:underline">
                            View All!
                        </Link>
                        </div>
                    </div>
              </div>
              <div className="col-6">
              <div className="card">
                      <div className="card__header">
                          <h3 className='text-xl font-bold'>Đơn hàng gần nhất</h3>
                      </div>
                      <div className="card__body p-4">
                        <table className="w-full text-base table-fixed">
                            <colgroup>
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold">ID</th>
                                    <th className="px-3 py-2 text-left font-semibold">Tên</th>
                                    <th className="px-3 py-2 text-left font-semibold">Trạng thái</th>
                                    <th className="px-3 py-2 text-left font-semibold">Tiền</th>
                                    <th className="px-3 py-2 text-left font-semibold">Điện thoại</th>
                                </tr>
                                </thead>
                                <tbody>
                                {topOrders.map((order, idx) => (
                                    <tr key={order.id || idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">{idx + 1}</td>
                                    <td className="px-3 py-2">{order.receiver_name}</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            order.order_status === "PAID"
                                            ? "bg-green-100 text-green-800"
                                            : order.order_status === "UNPAID"
                                            ? "bg-red-100 text-red-800"
                                            : order.order_status === "PREPARING_ORDER"
                                            ? "bg-blue-100 text-blue-800"
                                            : order.order_status === "ORDER_CANCELED"
                                            ? "bg-red-100 text-red-800"
                                            : order.order_status === "ORDER_RECEIVED"
                                            ? "bg-purple-100 text-purple-800"
                                            : order.order_status === "DELIVERING"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : order.order_status === "ORDER_CONFIRMED"
                                            ? "bg-indigo-100 text-indigo-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}>
                                            {order.order_status || 'N/A'}
                                        </span>
                                        </td>
                                    <td className="px-3 py-2">{order.price}</td>
                                    <td className="px-3 py-2">{order.phone_number}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        {topRestaurants.length === 0 && (
                            <div className="text-gray-500 text-center py-2">Không có dữ liệu</div>
                        )}
                        </div>
                        <div className="card__footer px-4 py-3 border-t border-gray-200">
                        <Link to='/admin/all-order' className="text-blue-600 hover:underline">
                            View All!
                        </Link>
                        </div>
                    </div>
              </div>
          </div>
      </div>
  )
};

export default Dashboard;
