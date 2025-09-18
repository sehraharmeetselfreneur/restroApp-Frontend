import { Route, Routes } from "react-router-dom";
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
        return <PageLoader />;
    }

    return (
        <div>
            <Routes>
                <Route path="/restaurant/signup" element={user ? <HomePage /> : <RestaurantSignupPage />} />
                <Route path="/restaurant/login" element={user ? <HomePage /> : <RestaurantLoginPage />} />

                {/* <Route path="/signup" element={user ? <HomePage /> : <CustomerSignupPage />} />
                <Route path="/login" element={user ? <HomePage /> : <CustomerLoginPage />} /> */}

                <Route path="/" element={<HomePage />} />

                <Route path="/restaurant/dashboard" element={<RestaurantDashboardPage />} />
            </Routes>
        </div>
    )
}

export default App
