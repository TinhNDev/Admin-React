
import { privateRoutes } from "./privateRoutes";
import ProtectRoutes from "./ProtectRoutes";
import MainLayout from "../../layout/MainLayout";

// Hàm này phải được export
export const getRoutes = () => {
    const protectedRoutes = privateRoutes.map(route => ({
        ...route,
        element: <ProtectRoutes>{route.element}</ProtectRoutes>
    }));

    return {
        path: "/",
        element: <MainLayout />,
        children: protectedRoutes
    };
};
