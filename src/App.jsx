import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";


function App() {

    const navigate = useNavigate(); 

    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

    useEffect(() => {
        // Lấy routes từ hàm getRoutes
        const protectedRoutes = getRoutes();
        // Kết hợp public routes và protected routes
        setAllRoutes([...publicRoutes, protectedRoutes]);
    }, []);

    return <Router allRoutes={allRoutes} />;
}

export default App;
