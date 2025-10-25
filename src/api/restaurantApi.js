import axiosInstance from "../utils/axios";

export const registerRestaurant = async ({ formData, documents }) => {
    try{
        const data = new FormData();

        //Normal fields
        data.append("restaurantName", formData.restaurantName);
        data.append("ownerName", formData.ownerName);
        data.append("description", formData.description);
        data.append("phone", formData.phone);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("openingTime", formData.openingTime);
        data.append("closingTime", formData.closingTime);

        data.append("address", JSON.stringify(formData.address));
        data.append("licenseNumber", JSON.stringify(formData.licenseNumber));
        data.append("cuisines", JSON.stringify(formData.cuisines));

        if (formData.bannerImage) {
            data.append("bannerImage", formData.bannerImage);
        }
    
        // Images array (multiple files)
        formData.images.forEach((file) => {
          data.append("images", file);
        });

        data.append("bankDetails", JSON.stringify(formData.bankDetails));

        // Documents
        if (documents.fssaiLicense) data.append("fssaiLicense", documents.fssaiLicense);
        if (documents.gstCertificate) data.append("gstCertificate", documents.gstCertificate);
        if (documents.panCard) data.append("panCard", documents.panCard);

        const res = await axiosInstance.post('/restaurant/register', data, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    }
    catch(err){
        console.log("Error in registerRestaurant: ", err.message);
        throw err;
    }
}

export const generateOtp = async (email) => {
    try{
        const res = await axiosInstance.post('/api/restaurant/generate-otp', { email });
        return res.data;
    }
    catch(err){
        console.log("Error in generateOtp: ", err.message);
        throw err;
    }
}

export const verifyOtp = async ({ email, otp }) => {
    try{
        const res = await axiosInstance.post('/restaurant/verify-otp', { email, otp });
        return res.data;
    }
    catch(err){
        console.log("Error in verifyOtp: ", err.message);
        throw err;
    }
}

export const loginRestaurant = async (formData) => {
    try{
        const res = await axiosInstance.post('/restaurant/login', formData);
        return res.data;
    }
    catch(err){
        console.log("Error in loginRestaurant: ", err);
        throw err;
    }
}

export const restaurantLogout = async () => {
    try{
        const res = axiosInstance.post('/restaurant/logout', {}, { withCredentials: true });
        return res.data;
    }
    catch(err){
        console.log("Error in restaurantLogout: ", err);
        throw err;
    }
}

export const getRestaurantProfile = async () => {
    try{
        const res = await axiosInstance.get('/restaurant/profile');
        return res.data;
    }
    catch(err){
        throw err;
    }
}

export const addMenuCategory = async (formData) => {
    try{
        const res = await axiosInstance.post('/restaurant/menu', formData);
        return res.data;
    }
    catch(err){
        console.log("Error in addMenuCategory: ", err);
        throw err;
    }
}

export const addFoodItem = async ({ formData }) => {
    try{
        const data = new FormData();
        console.log(formData);

        data.append("restaurantName", formData.restaurantName);
        data.append("category_name", formData.category_name);        
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("discount_price", formData.discount_price);
        data.append("isAvailable", formData.isAvailable);
        data.append("preparationTime", formData.preparationTime);
        data.append("isVeg", formData.isVeg);
        data.append("tags", JSON.stringify(formData.tags));
        data.append("variants", JSON.stringify(formData.variants));
        formData.images.forEach((image) => data.append("images", image));

        const res = await axiosInstance.post('/restaurant/food-item', data, { headers: { "Content-Type" : "multipart/form-data" } });
        return res.data;
    }
    catch(err){
        console.log("Error in addFoodItem: ", err);
        throw err;
    }
}

export const updateFoodItem = async ({ formData, foodItemId }) => {
    try{
        const data = new FormData();

        data.append("restaurantName", formData.restaurantName);
        data.append("category_name", formData.category_name);        
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("discount_price", formData.discount_price);
        data.append("isAvailable", formData.isAvailable);
        data.append("preparationTime", formData.preparationTime);
        data.append("isVeg", formData.isVeg);
        data.append("tags", JSON.stringify(formData.tags));
        data.append("variants", JSON.stringify(formData.variants));

        const res = await axiosInstance.put(`/restaurant/food-item/${foodItemId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    }
    catch(err){
        console.log("Error in updateFoodItem: ", err);
        throw err;
    }
}

export const deleteFoodItem = async (foodItemId) => {
    try{
        const res = await axiosInstance.delete(`/restaurant/food-item/${foodItemId}`);
        return res.data;
    }
    catch(err){
        console.log("Error in deleteFoodItem: ", err);
        throw err;
    }
}

export const updateRestaurantAvailability = async () => {
    try{
        const res = await axiosInstance.put('/restaurant/available');
        return res.data;
    }
    catch(err){
        console.log("Error in updateRestaurantAvailability: ", err);
        throw err;
    }
}

export const acceptOrder = async (orderId) => {
    try{
        console.log(orderId);
        const res = await axiosInstance.put(`/order/${orderId}/status`, { orderId: orderId, status: "preparing" });
        return res.data;
    }
    catch(err){
        throw err;
    }
}

export const updateOutForDelivery = async (orderId) => {
    try{
        const res = await axiosInstance.put(`/order/${orderId}/status`, { orderId: orderId, status: "outForDelivery" });
        return res.data;
    }
    catch(err){
        console.log("Error in updateOutForDelivery: ", err);
        throw err;
    }
}

export const createOffer = async (offerData) => {
    try{
        const res = await axiosInstance.post('/offer/create', offerData);
        return res.data;
    }
    catch(err){
        console.log("Error in createOffer: ", err);
        throw err;
    }
}