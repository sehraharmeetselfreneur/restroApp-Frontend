import axiosInstance from "../utils/axios";

export const registerRestaurant = async ({ formData, documents }) => {
    try{
        const data = new FormData();

        //Normal fields
        data.append("restaurantName", formData.restaurantName);
        data.append("description", formData.description);
        data.append("phone", formData.phone);
        data.append("email", formData.email);
        data.append("openingTime", formData.openingTime);
        data.append("closingTime", formData.closingTime);

        // Nested fields (address)
        data.append("address[street]", formData.address.street);
        data.append("address[city]", formData.address.city);
        data.append("address[state]", formData.address.state);
        data.append("address[pincode]", formData.address.pincode);
        data.append("address[geoLocation][lat]", formData.address.geoLocation.lat ?? "");
        data.append("address[geoLocation][lng]", formData.address.geoLocation.lng ?? "");

        // License numbers
        data.append("licenseNumber[fssai]", formData.licenseNumber.fssai);
        data.append("licenseNumber[gst]", formData.licenseNumber.gst);

        // Cuisines array
        formData.cuisines.forEach((cuisine, index) => {
          data.append(`cuisines[${index}]`, cuisine);
        });
    
        // Images array (multiple files)
        formData.images.forEach((file) => {
          data.append("images", file);
        });

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
        console.log("Error in loginRestaurant: ", err.message);
        throw err;
    }
}

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