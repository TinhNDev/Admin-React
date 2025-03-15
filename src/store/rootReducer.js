import authReducer from "./reducers/authReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import restaurantReducer from "./reducers/restaurantReducer";
import driverReducer from "./reducers/driverReducer";


const rootReducer = {
    auth: authReducer,
    dashboard: dashboardReducer,
    restaurant : restaurantReducer,
    driver : driverReducer
}
export default rootReducer;