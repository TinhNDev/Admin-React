import authReducer from "./reducers/authReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import restaurantReducer from "./reducers/restaurantReducer";
import driverReducer from "./reducers/driverReducer";
import productReducer from "./reducers/productReducer";
import couponReducer from "./reducers/couponReducer";


const rootReducer = {
    auth: authReducer,
    dashboard: dashboardReducer,
    restaurant : restaurantReducer,
    driver : driverReducer,
    product: productReducer,
    coupon:couponReducer
}
export default rootReducer;