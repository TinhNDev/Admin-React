import React from 'react'
import statusCards from '../data/JsonData/status-card-data.json'
import Chart from 'react-apexcharts'
import StatusCard from '../components/status-card'
import Table from '../components/table'
import {Link} from 'react-router-dom'
import Badge from '../components/badge'
import {  useSelector } from 'react-redux'

// Giả lập dữ liệu doanh thu từng ngày cho từng tháng
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

const TopCustomers={
  head:[
      'user',
      'total orders',
      'total spending'
  ],
  body:[
      {
          "username":"frank iwa",
          "order":"250",
          "price" : "$12,251"
      },
      {
          "username":"frank iwa",
          "order":"250",
          "price" : "$12,251"
      },
      {
          "username":"frank iwa",
          "order":"250",
          "price" : "$12,251"
      },
      {
          "username":"frank iwa",
          "order":"250",
          "price" : "$12,251"
      },
      {
          "username":"frank iwa",
          "order":"250",
          "price" : "$12,251"
      },
  ]
}


const renderCusomerHead = (item,index) =>(
  <th key={index}>
      {item}
  </th>
)

const renderCusomerBody = (item,index) => (
  <tr key={index}>
      <td>{item.username}</td>
      <td>{item.order}</td>
      <td>{item.price}</td>
  </tr>
)

const latestOrders = {
  header: [
      "order id",
      "user",
      "total price",
      "date",
      "status"
  ],
  body: [
      {
          id: "#OD1711",
          user: "john doe",
          date: "17 Jun 2021",
          price: "$900",
          status: "shipping"
      },
      {
          id: "#OD1712",
          user: "frank iva",
          date: "1 Jun 2021",
          price: "$400",
          status: "paid"
      },
      {
          id: "#OD1713",
          user: "anthony baker",
          date: "27 Jun 2021",
          price: "$200",
          status: "pending"
      },
      {
          id: "#OD1712",
          user: "frank iva",
          date: "1 Jun 2021",
          price: "$400",
          status: "paid"
      },
      {
          id: "#OD1713",
          user: "anthony baker",
          date: "27 Jun 2021",
          price: "$200",
          status: "refund"
      }
  ]
}

const orderStatus = {
  "shipping": "primary",
  "pending": "warning",
  "paid": "success",
  "refund": "danger"
}

const renderOrderHead = (item, index) => (
  <th key={index}>{item}</th>
)

const renderOrderBody = (item, index) => (
  <tr key={index}>
      <td>{item.id}</td>
      <td>{item.user}</td>
      <td>{item.price}</td>
      <td>{item.date}</td>
      <td>
          <Badge type={orderStatus[item.status]} content={item.status}/>
      </td>
  </tr>
)

const Dashboard = () => {
  const themeReducer = useSelector(state => state.ThemeReducer.mode)

  // const dispatch = useDispatch()

  // useEffect(() => {

  // })
  return (
      <div>
          <h2 className="page-header">
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
              <div className="col-4">
                  <div className="card">
                      <div className="card__header">
                          <h3>top customers</h3>
                      </div>
                      <div className="card__body">
                          <Table
                              headData={TopCustomers.head}
                              renderHead={(item,index)=>renderCusomerHead(item,index)}

                              bodyData={TopCustomers.body}
                              renderBody={(item,index)=>renderCusomerBody(item,index)}
                          />
                      </div>
                      <div className="card__footer">
                          <Link to='/'>
                              View All!
                          </Link>
                      </div>
                  </div>
              </div>
              <div className="col-8">
                  <div className="card">
                      <div className="card__header">
                          <h3>latest orders</h3>
                      </div>
                      <div className="card__body">
                          <Table
                               headData={latestOrders.header}
                               renderHead={(item,index)=>renderOrderHead(item,index)}

                               bodyData={latestOrders.body}
                               renderBody={(item,index)=>renderOrderBody(item,index)}
                          />
                      </div>
                      <div className="card__footer">
                          <Link to="/">view ALl</Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
};

export default Dashboard;
