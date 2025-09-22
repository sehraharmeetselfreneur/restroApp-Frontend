import axiosInstance from "../utils/axios";

export const registerAdmin = async (formData) => {
    try{
        const res = await axiosInstance.post('/admin/register', formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    }
    catch(err){
        console.log("Error in registerAdmin: ", err);
        throw err;
    }
}

export const getAdminProfile = async () => {
    try{
        const res = await axiosInstance.get('/admin/profile');
        return res.data;
    }
    catch(err){
        console.log("Error in getAdminProfile: ", err);
        throw err;
    }
}