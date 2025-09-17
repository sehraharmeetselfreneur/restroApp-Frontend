import axiosInstance from "../utils/axios";

export const getRestaurantProfile = async () => {
    try{
        const res = await axiosInstance.get("/restaurant/profile");
        return res.data;
    }
    catch(err){
        console.log("Error in getRestaurantProfile: ", err.message);
        throw err;
    }
}