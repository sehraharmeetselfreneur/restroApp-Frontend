import axiosInstance from "../utils/axios";

export const createOrder = async (orderData) => {
    try{
        console.log(orderData);
        const res = await axiosInstance.post('/order/create', { orderData });
        return res.data;
    }
    catch(err){
        console.log("Error in createOrder: ", err);
        throw err;
    }
}