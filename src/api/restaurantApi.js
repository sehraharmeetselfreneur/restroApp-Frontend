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