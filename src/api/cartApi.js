import axiosInstance from "../utils/axios";

export const addToCartApi = async (data) => {
    try{
        const res = await axiosInstance.post('/cart/add', data);
        return res.data;
    }
    catch(err){
        console.log("Error in addToCartApi: ", err);
        throw err;
    }
}

export const removeFromCartApi = async (foodItemId, variant) => {
    try{
        const variantId = variant ? variant : "";
        const res = await axiosInstance.post(`/cart/remove/${foodItemId}/${variantId ? variantId : null}`);
        return res.data;
    }
    catch(err){
        console.log("Error in removeFromCartApi: ", err);
        throw err;
    }
}

export const removeItemFromCartApi = async ({ itemId, variantId }) => {
    try{
        const data = {
            foodItemId: itemId,
            variantId: variantId || ""
        };

        console.log(data);

        const res = await axiosInstance.post('/cart/delete', data);
        return res.data;
    }
    catch(err){
        console.log("Error in removeItemFromCartApi: ", err);
        throw err;
    }
}

export const clearCartApi = async () => {
    try{
        const res = await axiosInstance.delete('/cart/clear');
        return res.data;
    }
    catch(err){
        console.log("Error in clearCartApi: ", err);
        throw err;
    }
}