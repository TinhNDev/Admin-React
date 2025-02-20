import { adminRoutes } from "./adminRoutes";
import { restaurantRoutes } from "./restaurantRoutes";
export const privateRoutes = [
    ...adminRoutes,
    ...restaurantRoutes
]
