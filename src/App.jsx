import { useQuery } from "@tanstack/react-query";

import useAuthStore from "./store/useAuthStore"
import { getCustomerProfile } from "./api/customerApi";
import { getRestaurantProfile } from "./api/restaurantApi";
import { Route, Routes } from "react-router-dom";
import RestaurantSignupPage from "./pages/auth/RestaurantSignupPage";
import RestaurantLoginPage from "./pages/auth/RestaurantLoginPage";
import HomePage from "./pages/HomePage";

const App = () => {
    const { user, role, setUser, clearUser } = useAuthStore();

    const customerQuery = useQuery({
        queryKey: ["customerProfile"],
        queryFn: getCustomerProfile,
        enabled: !user,
        retry: false,
        onSuccess: (data) => setUser(data, "customer"),
        onError: () => restaurantQuery.refetch()
    });

    const restaurantQuery = useQuery({
        queryKey: ["restaurantProfile"],
        queryFn: getRestaurantProfile,
        enabled: false,
        retry: false,
        onSuccess: (data) => setUser(data, "restaurant"),
        onError: () => clearUser()
    });

    if(customerQuery.isLoading || restaurantQuery.isFetching){
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div>
            <Routes>
                <Route path="/restaurant-signup" element={user ? <HomePage /> : <RestaurantSignupPage />} />
                <Route path="/restaurant-login" element={user ? <HomePage /> : <RestaurantLoginPage />} />

                {/* <Route path="/signup" element={user ? <HomePage /> : <CustomerSignupPage />} />
                <Route path="/login" element={user ? <HomePage /> : <CustomerLoginPage />} /> */}

                <Route path="/" element={<HomePage />} />
            </Routes>
        </div>
    )
}

export default App
