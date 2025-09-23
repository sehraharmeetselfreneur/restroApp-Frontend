import axiosInstance from "../utils/axios";

export const registerAdmin = async (formData) => {
    try{
        const res = await axiosInstance.post('/admin/register', formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    }
    catch(err){
        console.log("Error in registerAdmin: ", err);
        throw err;
    }
}

export const loginAdmin = async (formData) => {
    try{
        const res = await axiosInstance.post('/admin/login', formData);
        return res.data;
    }
    catch(err){
        console.log("Error in loginAdmin: ", err);
        throw err;
    }
}

export const logoutAdmin = async () => {
    try{
        const res = await axiosInstance.post('/admin/logout');
        return res.data;
    }
    catch(err){
        console.log("Error in logoutAdmin: ", err);
        throw err;
    }
}

export const getAdminProfile = async () => {
    try{
        const res = await axiosInstance.get('/admin/profile');
        return res.data;
    }
    catch(err){
        console.log("Error in getAdminProfile: ", err);
        throw err;
    }
}

export const getAllRestaurants = async () => {
    try{
        const res = await axiosInstance.get('/admin/restaurants');
        return res.data;
    }
    catch(err){
        console.log("Error in getAllRestaurants: ", err);
        throw err;
    }
}

export const approveRestaurant = async ({ isVerified, restaurantId }) => {
    try{
        const res = await axiosInstance.post(`/admin/verify-restaurant/${restaurantId}`, { isVerified });
        return res.data;
    }
    catch(err){
        console.log("Error in approveRestaurant: ", err);
        throw err;
    }
}

export const rejectRestaurant = async ({ isVerified, restaurantId }) => {
    try{
        const res = await axiosInstance.post(`/admin/verify-restaurant/${restaurantId}`, isVerified);
        return res.data;
    }
    catch(err){
        console.log("Error in rejectRestaurant: ", err);
        throw err;
    }
}

export const getAllCustomers = async () => {
    try{
        const res = await axiosInstance.get('/admin/customers');
        return res.data;
    }
    catch(err){
        console.log("Error in getAllCustomers: ", err);
        throw err;
    }
}

export const getAllOrders = async () => {
    try{
        const res = await axiosInstance.get('/admin/orders');
        return res.data;
    }
    catch(err){
        console.log("Error in getAllOrders: ", err);
        throw err;
    }
}