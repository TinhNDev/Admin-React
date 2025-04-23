import React,  { useEffect }  from 'react'
import Chart from 'react-apexcharts'
import StatusCard from '../components/status-card'
import { get_allRestaurant } from '../store/reducers/restaurantReducer';
import { get_allDriver } from '../store/reducers/driverReducer';
import { get_allOrder } from "../store/reducers/orderReducer";

import {Link} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'


const chartOptions = {
  series: [
      {
          name:'Online Customers',
          data:[40,70,20,90,36,80,30,91,60]
      },
      {
          name:'Store Customers',
          data:[40,20,90,10,63,20,70,11,30,20]
      },
  ],
  options:{
      color:['#6ab04c','#2980b9'],
      chart:{
          background: 'transparent',
      },
      dataLabels:{
          enabled: false,
      },
      stroke:{
          curve:'smooth',
      },
      xaxis:{
          categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep']
      },
      legend:{
          position:'top'
      },
      grid: {
          show:false,
      }
  }
}






const Dashboard = () => {
    const dispatch = useDispatch();
  const themeReducer = useSelector(state => state.ThemeReducer.mode)
  const { restaurants, totalRestaurant } = useSelector(state => state.restaurant);
 const { drivers, totalDrivers } = useSelector(state => state.driver);
   const orderState = useSelector((state) => state.order || {});
   const { orders, totalOrders } = orderState;
    useEffect(() => {
        dispatch(get_allRestaurant());
    }, []);

    useEffect(() => {
        dispatch(get_allDriver());
    }, []);

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
          <h2 className="page-header text-2xl font-bold" >
              Dashboard
          </h2>
          <div className="row">
              <div className="col-6">
                  <div className="row">
                      {
                          statusCards.map((item,index) =>(
                              <div className="col-6" key={index}>
                                  <StatusCard
                                      icon={item.icon}
                                      count = {item.count}
                                      title={item.title}
                                  />
                              </div>
                          ))
                      }
                  </div>
              </div>
              <div className="col-6">
                  <div className="card full-height">
                      {
                          
                      }
                      <Chart 
                           options={themeReducer === 'theme-mode-dark' ? {
                              ...chartOptions.options,
                              theme: { mode: 'dark'}
                          } : {
                              ...chartOptions.options,
                              theme: { mode: 'light'}
                          }}
                          series={chartOptions.series}
                          type='line'
                          height='100%'
                      />
                  </div>
              </div>
              <div className="col-3">
                    <div className="card">
                        <div className="card__header px-4 py-3 border-b border-gray-200">
                        <h3 className='text-lg font-bold text-gray-700'>Restaurant</h3>
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
                          <h3 className='text-xl font-bold'>Shipper</h3>
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
                        <Link to='/admin/restaurant' className="text-blue-600 hover:underline">
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
                            <col className="w-1/6" />
                            <col className="w-1/6" />
                            <col className="w-1/6" />
                            <col className="w-1/6" />
                            <col className="w-1/6" />
                            <col className="w-1/6" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold">ID</th>
                                    <th className="px-3 py-2 text-left font-semibold">Tên</th>
                                    <th className="px-3 py-2 text-left font-semibold">Địa chỉ</th>
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
                                    <td className="px-3 py-2">{order.address_receiver}</td>
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
