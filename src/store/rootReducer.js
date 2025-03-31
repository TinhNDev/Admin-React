import authReducer from "./reducers/authReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import restaurantReducer from "./reducers/restaurantReducer";
import driverReducer from "./reducers/driverReducer";
import productReducer from "./reducers/productReducer";


const rootReducer = {
    auth: authReducer,
    dashboard: dashboardReducer,
    restaurant : restaurantReducer,
    driver : driverReducer,
    product: productReducer
}
export default rootReducer;