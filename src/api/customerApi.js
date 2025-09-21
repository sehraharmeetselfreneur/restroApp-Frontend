import axiosInstance from "../utils/axios";

export const registerCustomer = async (formData) => {
    try{
        const res = await axiosInstance.post("/customer/register", formData);
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
        console.log("Error in getCustomerProfile: ", err);
        throw err;
    }
}