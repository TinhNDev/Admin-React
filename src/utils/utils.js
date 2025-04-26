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
