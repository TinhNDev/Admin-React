import React, { useEffect, useState } from 'react';
import { MdCurrencyExchange } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { TbUser } from "react-icons/tb";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { MdOutlineRestaurant } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_dashboard_data } from '../store/reducers/dashboardReducer';

// Giả lập dữ liệu doanh thu từng ngày cho từng tháng
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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  

const monthlyRevenue = [
  15000, 18000, 21000, 24000, 20000, 23000, 26000, 28000, 30000, 32000, 29000, 35000
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { totalProduct, totalSeller, totalShipper } = useSelector(state => state.dashboard);

  const [view, setView] = useState('month'); // 'month' hoặc 'day'
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Chart options cho doanh thu theo tháng
  const monthChartOptions = {
    chart: {
      type: 'bar',
      events: {
        dataPointSelection: function(event, chartContext, config) {
          setSelectedMonth(config.dataPointIndex);
          setView('day');
        }
      }
    },
    xaxis: {
      categories: monthLabels,
      title: { text: 'Months' }
    },
    yaxis: {
      title: { text: 'Revenue (VND)' }
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: function(val) { return `$${val.toLocaleString()}`; }
      }
    }
  };

  // Chart options cho doanh thu theo ngày của một tháng
  const dayChartOptions = {
    chart: { type: 'bar' },
    xaxis: {
      categories: selectedMonth !== null
        ? Array.from({ length: dailyRevenueByMonth[selectedMonth].length }, (_, i) => `Ngày ${i + 1}`)
        : [],
      title: { text: selectedMonth !== null ? `Ngày trong ${monthLabels[selectedMonth]}` : '' }
    },
    yaxis: {
      title: { text: 'Revenue ($)' }
    },
    colors: ['#f59e42'],
    tooltip: {
      y: {
        formatter: function(val) { return `$${val.toLocaleString()}`; }
      }
    }
  };

  useEffect(() => {
    dispatch(get_admin_dashboard_data());
  }, [dispatch]);

  return (
    <div className='px-2 md:px-7 py-5'>
      <div className='w-full grid grid-cols-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
        <div className="flex justify-between items-center p-5 bg-[#fae8e8] rounded-md w-full">
          <div className="flex flex-col text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">1000$</h2>
            <span className="text-md font-medium">Total Sales</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#fde2ff] rounded-md w-full">
          <div className="flex flex-col text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">{totalSeller}</h2>
            <span className="text-md font-medium">Restaurant</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#760077] flex justify-center items-center text-xl">
            <MdOutlineRestaurant className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#e9feea] rounded-md w-full">
          <div className="flex flex-col text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">{totalShipper}</h2>
            <span className="text-md font-medium">Shipper</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#038000] flex justify-center items-center text-xl">
            <FaUsers className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#ecebff] rounded-md w-full">
          <div className="flex flex-col text-[#5c5a5a]">
            <h2 className="text-3xl font-bold">{totalProduct}</h2>
            <span className="text-md font-medium">Product</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#0200f8] flex justify-center items-center text-xl">
            <TbUser className="text-[#fae8e8] shadow-lg" />
          </div>
        </div>
      </div>

      <div className='w-full flex flex-wrap mt-7'>
        <div className='w-full lg:w-7/12 lg:pr-3'>
          <div className='w-full bg-[#e5e4eb] p-4 rounded-md'>
            {view === 'month' && (
              <div>
                <div className="flex gap-4 mb-4">
                  <button
                    className="px-4 py-2 rounded bg-blue-500 text-white"
                    disabled
                  >
                    Months
                  </button>
                </div>
                <Chart
                  options={monthChartOptions}
                  series={[{ name: 'Doanh thu', data: monthlyRevenue }]}
                  type="bar"
                  height={350}
                />
                <p className="text-sm text-gray-500 mt-2">* Click on the monthly column to see daily revenue details</p>
              </div>
            )}
            {view === 'day' && selectedMonth !== null && (
              <div>
                <button
                  className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setView('month')}
                >
                  ← Back
                </button>
                <Chart
                  options={dayChartOptions}
                  series={[{ name: 'Revenue', data: dailyRevenueByMonth[selectedMonth] }]}
                  type="bar"
                  height={350}
                />
              </div>
            )}
          </div>
        </div>
        <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
          <div className='w-full bg-[#e5e4eb] p-4 rounded-md text-[#000000]'>
            <div className='flex justify-between items-center'>
              <h2 className='font-semibold text-lg text-[#000000] pb-3'>All Order</h2>
              <Link className='font-semibold text-sm text-[#000000]'>View All</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
