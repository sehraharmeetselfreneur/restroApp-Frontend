import axiosInstance from "../utils/axios";

export const getNearByRestaurants = async ({ user, distance }) => {
    try{
        const res = await axiosInstance.get(`/home/restaurants?lat=${user ? user.profile.address[0].geoLocation.lat : 28.632843065567464}&lng=${user ? user.profile.address[0].geoLocation.lng : 77.21688030617712}&radius=${distance ? distance : 30000}`);
        return res.data;
    }
    catch(err){
        console.log("Error in getNearByRestaurants: ", err);
        throw err;
    }
}

export const getParticularRestaurant = async ({ id, user }) => {
    try{
        const res = await axiosInstance.get(`/home/restaurant/${id}?lat=${user ? user.profile.address[0].geoLocation.lat : 28.632843065567464}&lng=${user ? user.profile.address[0].geoLocation.lng : 77.21688030617712}`);
        console.log(res.data);
        return res.data;
    }
    catch(err){
        console.log("Error in getParticularRestaurant: ", err);
        throw err;
    }
}