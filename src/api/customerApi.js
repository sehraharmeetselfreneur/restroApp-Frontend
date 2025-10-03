import axiosInstance from "../utils/axios";

export const registerCustomer = async (formData) => {
    try{
        const data = new FormData();

        data.append("customerName", formData.customerName);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("phone", formData.phone);
        data.append("dob", formData.dob);
        data.append("gender", formData.gender);
        data.append("address", JSON.stringify(formData.address));
        data.append("profileImage", formData.profileImage);

        const res = await axiosInstance.post("/customer/register", data, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    }
    catch(err){
        console.log("Error in registerCustomer: ", err);
        throw err;
    }
}

export const loginCustomer = async (formData) => {
    try{
        const res = await axiosInstance.post('/customer/login', formData);
        return res.data;
    }
    catch(err){
        console.log("Error in loginCustomer: ", err);
        throw err;
    }
}

export const getCustomerProfile = async () => {
    try{
        const res = await axiosInstance.get("/customer/profile");
        return res.data;
    }
    catch(err){
        throw err;
    }
}

export const logoutCustomer = async () => {
    try{
        const res = await axiosInstance.post('/customer/logout');
        return res.data;
    }
    catch(err){
        console.log("Error in logoutCustomer: ", err);
        throw err;
    }
}

export const updateCustomerProfile = async (data) => {
    try{
        const res = await axiosInstance.put('/customer/profile', data);
        return res.data;
    }
    catch(err){
        console.log("Error in updateProfile: ", err);
        throw err;
    }
}

export const addAddress = async (newAddress) => {
    try{
        const res = await axiosInstance.post('/customer/address', newAddress);
        return res.data;
    }
    catch(err){
        console.log("Error in addAddress: ", err);
        throw err;
    }
}

export const deleteAddress = async ({ tag }) => {
    try{
        const res = await axiosInstance.post(`/customer/address/${tag}`);
        return res.data;
    }
    catch(err){
        console.log("Error in deleteAddress: ", err);
        throw err;
    }
}

export const updateFavourites = async (id) => {
    try{
        const res = await axiosInstance.post(`/customer/favourites/${id}`);
        return res.data;
    }
    catch(err){
        console.log("Error in updateFavourites: ", err);
        throw err;
    }
}