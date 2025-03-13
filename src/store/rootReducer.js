import authReducer from "./reducers/authReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import restaurantReducer from "./reducers/restaurantReducer";


const rootReducer = {
    auth: authReducer,
    dashboard: dashboardReducer,
    restaurant : restaurantReducer
}
export default rootReducer;