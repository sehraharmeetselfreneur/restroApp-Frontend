import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

//Zustand store
import useAuthStore from "./store/useAuthStore";

//API Calls
import { getCustomerProfile } from "./api/customerApi";
import { getRestaurantProfile } from "./api/restaurantApi";

//PageLoader
import PageLoader from "./components/PageLoader";

//Auth Pages
import RestaurantSignupPage from "./pages/auth/RestaurantSignupPage";
import RestaurantLoginPage from "./pages/auth/RestaurantLoginPage";

//Public Pages
import HomePage from "./pages/HomePage";

//Restaurant Pages
import RestaurantDashboardPage from "./pages/restaurant/RestaurantDashboardPage";
import CustomerSignupPage from "./pages/auth/CustomerSignupPage";
import CustomerLoginPage from "./pages/auth/CustomerLoginPage";
import AdminSignupPage from "./pages/auth/admin/AdminSignupPage";
import { getAdminProfile } from "./api/adminApi";

const App = () => {
    const { user, role, setUser, clearUser } = useAuthStore();
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAuthInitialized(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const customerQuery = useQuery({
        queryKey: ["customerProfile"],
        queryFn: getCustomerProfile,
        enabled: authInitialized && !user,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
        cacheTime: 0,
    });

    const restaurantQuery = useQuery({
        queryKey: ["restaurantProfile"],
        queryFn: getRestaurantProfile,
        enabled: authInitialized && !user,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
        cacheTime: 0
    });

    const adminQuery = useQuery({
        queryKey: ["adminProfile"],
        queryFn: getAdminProfile,
        enabled: authInitialized && !user,
        retry: false,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (user) return; // user already set, no need to run

        if (customerQuery.isSuccess && customerQuery.data) {
            setUser(customerQuery.data, "Customer");
        } else if (restaurantQuery.isSuccess && restaurantQuery.data) {
            setUser(restaurantQuery.data, "Restaurant");
        } else if (adminQuery.isSuccess && adminQuery.data) {
            setUser(adminQuery.data, "Admin");
        } else if (
            customerQuery.isError &&
            restaurantQuery.isError &&
            adminQuery.isError
        ) {
            // Only call clearUser if it's not already null
            clearUser();
        }
    }, [
        user,
        customerQuery.data, customerQuery.isSuccess, customerQuery.isError,
        restaurantQuery.data, restaurantQuery.isSuccess, restaurantQuery.isError,
        adminQuery.data, adminQuery.isSuccess, adminQuery.isError
    ]);

    if (!authInitialized || customerQuery.isLoading || customerQuery.isFetching ||
        restaurantQuery.isLoading || restaurantQuery.isFetching || adminQuery.isLoading || adminQuery.isFetching){
        return <PageLoader />;
    }

    console.log(user);
    return (
        <div>
            <Routes>
                <Route path="/admin/signup" element={!user ? <AdminSignupPage /> : <Navigate to={"/admin"} />} /> 

                <Route path="/restaurant/signup" element={!user ? <RestaurantSignupPage /> : <Navigate to={"/restaurant/dashboard"} />} />
                <Route path="/restaurant/login" element={!user ? <RestaurantLoginPage /> : <Navigate to={"/restaurant/dashboard"} />} />

                <Route path="/customer/signup" element={!user ? <CustomerSignupPage /> : <Navigate to={"/"} />} />
                <Route path="/customer/login" element={!user ? <CustomerLoginPage /> : <Navigate to={"/"} />} />

                <Route path="/" element={<HomePage />} />

                <Route path="/restaurant/dashboard" element={(user && role === "Restaurant") ? <RestaurantDashboardPage /> : <Navigate to={"/restaurant/login"} />} />
            </Routes>
        </div>
    )
}

export default App
