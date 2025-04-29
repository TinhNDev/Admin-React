export const checkCouponStatus = (startDate, endDate, isActive) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!isActive)
    return {
      status: "inactive",
      text: "Đã khóa",
      className: "bg-red-100 text-red-800",
    };

  if (now < start) {
    return {
      status: "pending",
      text: "Chưa bắt đầu",
      className: "bg-yellow-100 text-yellow-800",
    };
  }

  if (now > end) {
    return {
      status: "expired",
      text: "Đã hết hạn",
      className: "bg-red-100 text-red-800",
    };
  }

  return {
    status: "active",
    text: "Đang hoạt động",
    className: "bg-green-100 text-green-800",
  };
};

/* Calculate daily revenue from orders
 * @param {Array} orders - Array of orders
 * @param {Date} date - Date to calculate revenue for
 * @returns {Object} Revenue details
 */
export const calculateDailyRevenue = (orders, date = new Date()) => {
  // Convert input date to start and end of day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Filter orders for the specified date
  const dailyOrders = orders.filter((order) => {
    const orderDate = new Date(order.order_date);
    return orderDate >= startOfDay && orderDate <= endOfDay;
  });

  // Calculate totals
  const revenue = dailyOrders.reduce((total, order) => {
    // Only count completed orders
    if (order.order_status === "ORDER_CONFIRMED") {
      const orderTotal =
        parseFloat(order.price) + parseFloat(order.delivery_fee);
      return total + orderTotal;
    }
    return total;
  }, 0);

  return {
    totalRevenue: revenue,
    orderCount: dailyOrders.length,
    completedOrders: dailyOrders.filter(
      (order) => order.order_status === "ORDER_CONFIRMED"
    ).length,
    canceledOrders: dailyOrders.filter(
      (order) => order.order_status === "ORDER_CANCELED"
    ).length,
    averageOrderValue:
      dailyOrders.length > 0 ? revenue / dailyOrders.length : 0,
  };
};
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
/**
 * Calculate revenue array for the last 12 months
 * @param {Array} orders - Array of orders
 * @returns {Array} Array of monthly revenue data
 */
export const getMonthlyRevenueArray = (orders) => {
  const months = [];
  const today = new Date();

  // Get last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Filter orders for this month
    const monthlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= startOfMonth && orderDate <= endOfMonth;
    });

    // Calculate revenue for confirmed orders
    const revenue = monthlyOrders.reduce((total, order) => {
      if (order.order_status === "ORDER_CONFIRMED") {
        return total + parseFloat(order.price);
      }
      return total;
    }, 0);

    months.push({
      month: date.toLocaleString("vi-VN", { month: "long" }),
      shortMonth: date.toLocaleString("vi-VN", { month: "short" }),
      year: date.getFullYear(),
      revenue: revenue,
      formattedRevenue: formatCurrency(revenue),
      orderCount: monthlyOrders.length,
      completedOrders: monthlyOrders.filter(
        (o) => o.order_status === "ORDER_CONFIRMED"
      ).length,
    });
  }

  return months;
};
