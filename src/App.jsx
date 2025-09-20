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
import { useEffect, useState } from "react";

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
        enabled: authInitialized && (!user || customerQuery.isError),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
        cacheTime: 0
    });

    useEffect(() => {
        if (customerQuery.isSuccess) {
            setUser(customerQuery.data, "Customer");
        } else if (customerQuery.isError && !customerQuery.isPending && !restaurantQuery.isFetching && !restaurantQuery.isSuccess) {
            console.log("Customer query error, trying restaurant");
            restaurantQuery.refetch();
        }
    }, [customerQuery.isSuccess, customerQuery.isError, customerQuery.data, customerQuery.isPending]);
    useEffect(() => {
        if (restaurantQuery.isSuccess && restaurantQuery.data) {
            setUser(restaurantQuery.data, "Restaurant");
        } else if (restaurantQuery.isError) {
            clearUser();
        }
    }, [restaurantQuery.isSuccess, restaurantQuery.isError, restaurantQuery.data]);

    if(!authInitialized || customerQuery.isLoading || restaurantQuery.isFetching){
        return <PageLoader />;
    }

    console.log(user);
    return (
        <div>
            <Routes>
                <Route path="/restaurant/signup" element={!user ? <RestaurantSignupPage /> : <Navigate to={"/restaurant/dashboard"} />} />
                <Route path="/restaurant/login" element={!user ? <RestaurantLoginPage /> : <Navigate to={"/restaurant/dashboard"} />} />

                {/* <Route path="/signup" element={user ? <HomePage /> : <CustomerSignupPage />} />
                <Route path="/login" element={user ? <HomePage /> : <CustomerLoginPage />} /> */}

                <Route path="/" element={<HomePage />} />

                <Route path="/restaurant/dashboard" element={user ? <RestaurantDashboardPage /> : <RestaurantLoginPage />} />
            </Routes>
        </div>
    )
}

export default App
