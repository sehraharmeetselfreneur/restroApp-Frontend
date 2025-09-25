import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

//Zustand store
import useAuthStore from "./store/useAuthStore";

//API Calls
import { getAdminProfile } from "./api/adminApi";
import { getRestaurantProfile } from "./api/restaurantApi";
import { getCustomerProfile } from "./api/customerApi";

//PageLoader
import PageLoader from "./components/PageLoader";

//Auth Pages
import RestaurantSignupPage from "./pages/auth/restaurant/RestaurantSignupPage";
import RestaurantLoginPage from "./pages/auth/restaurant/RestaurantLoginPage";

//Public Pages
import HomePage from "./pages/HomePage";

//Restaurant Pages
import RestaurantDashboardPage from "./pages/dashboards/RestaurantDashboardPage";
import CustomerSignupPage from "./pages/auth/customer/CustomerSignupPage";
import CustomerLoginPage from "./pages/auth/customer/CustomerLoginPage";
import AdminSignupPage from "./pages/auth/admin/AdminSignupPage";
import AdminLoginPage from "./pages/auth/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/dashboards/AdminDashboardPage";

const App = () => {
    const { user, role, setUser, clearUser } = useAuthStore();
    const [authInitialized, setAuthInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const customerQuery = useQuery({
        queryKey: ["customerProfile"],
        queryFn: getCustomerProfile,
        enabled: authInitialized && !user,
        retry: false,
        refetchOnWindowFocus: false
    });

    const restaurantQuery = useQuery({
        queryKey: ["restaurantProfile"],
        queryFn: getRestaurantProfile,
        enabled: authInitialized && !user,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const adminQuery = useQuery({
        queryKey: ["adminProfile"],
        queryFn: getAdminProfile,
        enabled: authInitialized && !user,
        retry: false,
        refetchOnWindowFocus: false
    });

    const fetchUserProfile = async () => {
        if (user) return;

        try {
            const [customerResult, restaurantResult, adminResult] = await Promise.allSettled([
                customerQuery.refetch(),
                restaurantQuery.refetch(),
                adminQuery.refetch()
            ]);

            // Check results in order of preference
            if (customerResult.status === 'fulfilled' && customerResult.value.isSuccess && customerResult.value.data) {
                setUser(customerResult.value.data, "Customer");
            } else if (restaurantResult.status === 'fulfilled' && restaurantResult.value.isSuccess && restaurantResult.value.data) {
                setUser(restaurantResult.value.data, "Restaurant");
            } else if (adminResult.status === 'fulfilled' && adminResult.value.isSuccess && adminResult.value.data) {
                setUser(adminResult.value.data, "Admin");
            } else {
                clearUser();
            }
        } catch (error) {
            console.error("Error fetching user profiles:", error);
            clearUser();
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    if (customerQuery.isLoading || customerQuery.isFetching ||
        restaurantQuery.isLoading || restaurantQuery.isFetching || adminQuery.isLoading || adminQuery.isFetching){
        return <PageLoader />;
    }

    console.log(user);

    return (
        <div>
            <Routes>
                <Route path="/admin/signup" element={!user ? <AdminSignupPage /> : (user && role === "Admin" ? <Navigate to={"/admin"} /> : <Navigate to={"/"} />)} />
                <Route path="/admin/login" element={!user ? <AdminLoginPage /> : (user && role === "Admin" ? <Navigate to={"/admin"} /> : <Navigate to={"/"} />)} />

                <Route path="/restaurant/signup" element={!user ? <RestaurantSignupPage /> : (user && role === "Restaurant" ? <Navigate to={"/restaurant/dashboard"} /> : <Navigate to={"/"} />)} />
                <Route path="/restaurant/login" element={!user ? <RestaurantLoginPage /> : (user && role === "Restaurant" ? <Navigate to={"/restaurant/dashboard"} /> : <Navigate to={"/"} />)} />

                <Route path="/customer/signup" element={!user ? <CustomerSignupPage /> : <Navigate to={"/"} />} />
                <Route path="/customer/login" element={!user ? <CustomerLoginPage /> : <Navigate to={"/"} />} />

                <Route path="/" element={<HomePage />} />

                <Route path="/restaurant/dashboard" element={(user && role === "Restaurant") ? <RestaurantDashboardPage /> : <Navigate to={"/restaurant/login"} />} />
                <Route path="/admin" element={user === null ? <PageLoader /> : role === "Admin" ? <AdminDashboardPage /> : <Navigate to="/" />} />
            </Routes>
        </div>
    )
}

export default App