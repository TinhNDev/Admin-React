import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import restaurantReducer from "./reducers/restaurantReducer";
import driverReducer from "./reducers/driverReducer";
import productReducer from "./reducers/productReducer";
import couponReducer from "./reducers/couponReducer";
import orderReducer from "./reducers/orderReducer";
import ThemeReducer from "./reducers/ThemeReducer";
import feedbackReducer from "./reducers/feedbackReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  restaurant: restaurantReducer,
  driver: driverReducer,
  product: productReducer,
  coupon: couponReducer,
  order: orderReducer,
  ThemeReducer: ThemeReducer,
  feedback: feedbackReducer,
});

export default rootReducer;
