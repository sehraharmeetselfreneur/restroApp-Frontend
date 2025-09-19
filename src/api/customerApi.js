import axiosInstance from "../utils/axios";

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