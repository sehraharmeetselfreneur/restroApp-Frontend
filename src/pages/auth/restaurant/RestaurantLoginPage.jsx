import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import validator from 'validator';
import toast from "react-hot-toast";

//Icons
import { FaEnvelope, FaKey, FaArrowRight, FaEyeSlash, FaEye } from "react-icons/fa";
import { MdOutlineWifiPassword } from "react-icons/md";

//API Functions
import { generateOtp, getRestaurantProfile, loginRestaurant, verifyOtp } from "../../../api/restaurantApi";
import useAuthStore from "../../../store/useAuthStore";

const RestaurantLoginPage = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    //Required mutations for login
    const loginRestaurantMutation = useMutation({
        mutationFn: loginRestaurant,
        onSuccess: async () => {
            localStorage.removeItem("restaurantLoginForm");
            try{
                const profileData = await getRestaurantProfile();
                
                if(profileData){
                    setUser(profileData, "Restaurant");
                    await queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
                    navigate('/restaurant/dashboard');
                    toast.success("Login successful");
                }
                else{
                    toast.error("Failed to fetch profile after login");
                }
            }
            catch(error){
                console.error("Error fetching profile after login:", error);
                toast.error("Login successful but failed to fetch profile");
            }
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        }
    })
    const generateOtpMutation = useMutation({
        mutationFn: generateOtp,
        onSuccess: (data) => {
            toast.success(data.message || "OTP sent successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    });
    const verifyOtpMutation = useMutation({
        mutationFn: verifyOtp,
        onSuccess: (data) => {
            toast.success(data.message || "OTP verified successfully");
            loginRestaurantMutation.mutate({ email: formData.email, password: formData.password });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Invalid OTP")
        }
    })

    const heroImageUrl = "https://images.unsplash.com/photo-1551270273-df33a598c430";
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        otp: "",
    });

    // Load saved form data from localStorage on mount
    useEffect(() => {
        const savedForm = localStorage.getItem("restaurantLoginForm");
        if (savedForm) {
            setFormData(JSON.parse(savedForm));
        }
    }, []);

    const handleChange = (field, value) => {
        const updatedForm = { ...formData, [field]: value };
        setFormData(updatedForm);
        setErrors({ ...errors, [field]: "" });

        localStorage.setItem("restaurantLoginForm", JSON.stringify(updatedForm));   // Save to localStorage
    };

    const validate = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        }
        else{
            if(!validator.isEmail(formData.email)){
                newErrors.email = "Enter a valid email address";
            }
            else{
                const domain = (formData.email.split("@")[1] || "").toLowerCase();
                const parts = domain.split(".");
                if(parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]){
                    newErrors.email = "Enter a valid email address";
                }
            }
        }
      
        // Password validation
        if(!formData.password){
            newErrors.password = "Password is required";
        }
        else if(formData.password.length < 6){
            newErrors.password = "Password must be at least 6 characters";
        }
      
        // OTP validation
        if(formData.otp && !/^\d{6}$/.test(formData.otp)){
            newErrors.otp = "OTP must be a 6-digit number";
        }
      
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        //Validation check on submit
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstError = Object.values(validationErrors)[0];
            toast.error(firstError);
            return;
        }

        // verifyOtpMutation.mutate({ email: formData.email, otp: formData.otp }); //Verifying OTP, if verified, loginMutation will be called after the success
        loginRestaurantMutation.mutate(formData);
    };

    const handleGenerateOtp = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        generateOtpMutation.mutate(formData.email);
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-slate-500 via-white to-slate-400 relative overflow-hidden">
            {/* Mobile Header - Only visible on mobile */}
            <div className="lg:hidden w-full text-center py-6 px-4 bg-slate-800 backdrop-blur-md">
                <span className="text-3xl sm:text-4xl font-extrabold text-orange-500">FlavorForge</span>
                <p className="text-white mt-1 text-sm">Partner Login</p>
            </div>

            {/* Form (Main content for mobile, Left part for desktop) */}
            <div className="bg-white w-full max-w-2xl lg:max-w-2xl rounded-none lg:rounded-2xl shadow-none lg:shadow-2xl m-0 lg:m-8 p-4 sm:p-6 md:p-8 lg:p-12 relative z-10 border-0 lg:border border-slate-100 min-h-[80vh] lg:min-h-0">
                {/* Logo and Title - Hidden on mobile (shown in header instead) */}
                <div className="text-center mb-6 lg:mb-10 select-none hidden lg:block">
                    <div className="flex justify-center mb-4">
                        <span className="text-4xl lg:text-5xl font-extrabold text-orange-500">FlavorForge</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                        Partner Login
                    </h1>
                    <p className="text-slate-500 mt-2 font-light text-base lg:text-lg">
                        Manage your restaurant with ease
                    </p>
                </div>

                {/* Mobile Title - Only visible on mobile */}
                <div className="text-center mb-8 lg:hidden">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 mt-2 font-light text-sm sm:text-base">
                        Login to manage your restaurant
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="relative group">
                        <FaEnvelope className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300 text-sm sm:text-base" />
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 font-medium text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                          <MdOutlineWifiPassword />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password *"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className="w-full p-4 pl-12 pr-12 font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-300 outline-none hover:border-slate-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors duration-300"
                        >
                            {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25}/>}
                        </button>
                    </div>

                    {/* OTP */}
                    <div className="relative group">
                        <FaKey className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300 text-sm sm:text-base" />
                        <input
                            type="text"
                            placeholder="Enter OTP (if applicable)"
                            value={formData.otp}
                            onChange={(e) => handleChange("otp", e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-20 sm:pr-32 py-3 sm:py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 font-medium text-sm sm:text-base"
                        />
                        <button
                            type="button"
                            onClick={handleGenerateOtp}
                            className="absolute cursor-pointer right-2 top-2 sm:top-3 text-xs sm:text-sm px-2 sm:px-4 py-2 bg-slate-100 text-slate-600 rounded-lg shadow-sm hover:bg-orange-500 hover:text-white transition-colors duration-300 font-semibold"
                        >
                            { generateOtpMutation.isPending ? "Sending..." : "Get OTP" }
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                        <span>{loginRestaurantMutation.isPending ? "Loggin in...." : "Login to Dashboard"}</span>
                        <FaArrowRight className={`text-sm ${loginRestaurantMutation.isPending ? "hidden" : ""}`} />
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-6 lg:mt-8 text-xs sm:text-sm select-none text-slate-500">
                    <p>
                        Don't have an account?{" "}
                        <Link
                            to="/restaurant/signup"
                            className="text-orange-600 cursor-pointer font-bold hover:underline hover:text-orange-700 transition"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Part - Desktop only */}
            <div className="hidden lg:flex w-1/2 h-screen relative overflow-hidden bg-orange-500">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 transform scale-100 group-hover:scale-105"
                    style={{ backgroundImage: `url(${heroImageUrl})` }}
                ></div>

                {/* Content Overlay */}
                <div className="relative z-10 p-8 xl:p-12 text-white flex flex-col justify-center gap-6 xl:gap-4 items-start">
                    <h1 className="text-3xl xl:text-4xl 2xl:text-5xl text-center w-full font-extrabold leading-tight tracking-wide drop-shadow-lg">
                        FlavorForge
                    </h1>
                    <div>
                        <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold leading-tight tracking-wide drop-shadow-lg">
                            Grow Your Business with Us
                        </h2>
                        <p className="mt-4 text-base xl:text-lg 2xl:text-xl font-light leading-relaxed drop-shadow-md">
                            Join our network of successful restaurants and unlock new opportunities. Streamline your operations, reach more customers, and elevate your brand.
                        </p>
                        <blockquote className="mt-6 xl:mt-8 text-sm italic border-l-4 border-orange-300 pl-4 text-white">
                            "Our revenue increased by 30% in the first three months. The platform is a game-changer!"
                            <footer className="mt-2 text-xs text-white">- Jane Doe, Owner of "The Local Eatery"</footer>
                        </blockquote>
                    </div>

                    <div className="flex justify-center items-start w-full">
                        <img
                            className="w-[75%] xl:w-[80%] h-[60%] xl:h-[80%] object-cover rounded-2xl"
                            src="https://images.unsplash.com/photo-1556745750-68295fefafc5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8UmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D" 
                            alt="Restaurant interior"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Footer - Optional promotional content */}
            <div className="lg:hidden w-full text-center py-4 px-4 bg-orange-500 text-white">
                <p className="text-sm font-medium">Join thousands of successful restaurants</p>
                <p className="text-xs mt-1 opacity-90">Grow your business with FlavorForge</p>
            </div>
        </div>
    );
};

export default RestaurantLoginPage;