import authReducer from "./reducers/authReducer";
import dashboardReducer from "./reducers/dashboardReducer";


const rootReducer = {
    auth: authReducer,
    dashboard: dashboardReducer
}
export default rootReducer;