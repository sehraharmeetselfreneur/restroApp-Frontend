import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, ChefHat, Star, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginCustomer } from '../../../api/customerApi';

const CustomerLoginPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("customerLoginForm");
        return saved
            ? JSON.parse(saved)
            : {
                email: "",
                password: ""
            }
    });
    const [showPassword, setShowPassword] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const loginCustomerMutation = useMutation({
        mutationFn: loginCustomer,
        onSuccess: () => {
            localStorage.removeItem("customerLoginForm");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
            toast.success('Login successful! Redirecting...');
            navigate("/");
        },
        onError: (err) => {
            toast.error(err.response.data?.message);
        }
    })

    useEffect(() => {
        localStorage.setItem("customerLoginForm", JSON.stringify(formData));
    }, [formData]);

    // OTP Timer countdown
    useEffect(() => {
        let interval = null;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(otpTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendOtp = async () => {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            toast.error('Email is required');
            return;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setOtpLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setOtpSent(true);
            setOtpTimer(60);
            toast.success('OTP sent successfully to your email');
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        // Validate email
        if (!formData.email) {
            toast.error("Email is required");
            return;
        }
        else{
            if(!validator.isEmail(formData.email)){
                toast.error("Enter a valid email address");
                return;
            }
            else{
                const domain = (formData.email.split("@")[1] || "").toLowerCase();
                const parts = domain.split(".");
                if(parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]){
                    toast.error("Enter a valid email address");
                    return;
                }
            }
        }

        // Validate password
        if (!formData.password) {
            toast.error("Password is required");
            return;
        } else {
            if (formData.password.length < 8) {
                toast.error("Password must be at least 8 characters long");
                return;
            } else if (!/[A-Z]/.test(formData.password)) {
                toast.error("Password must contain at least one uppercase letter");
                return;
            } else if (!/[a-z]/.test(formData.password)) {
                toast.error("Password must contain at least one lowercase letter");
                return;
            } else if (!/[0-9]/.test(formData.password)) {
                toast.error("Password must contain at least one number");
                return;
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
                toast.error("Password must contain at least one special character");
                return;
            }
        }

        // Validate OTP
        // if (!formData.otp) {
        //     toast.error('OTP is required');
        //     return;
        // }
        // if (!/^\d{6}$/.test(formData.otp)) {
        //     toast.error('OTP must be 6 digits');
        //     return;
        // }

        // if (!otpSent) {
        //     toast.error('Please send OTP first');
        //     return;
        // }

        loginCustomerMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Display Section */}
            <div className="hidden lg:flex lg:w-1/2 justify-center items-center select-none bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full -translate-y-48 translate-x-48"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full translate-y-40 -translate-x-40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    {/* Logo/Brand */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <ChefHat className="w-8 h-8 text-white" />
                            </div>
                            <span onClick={() => navigate("/")} className="text-3xl font-bold cursor-pointer">FlavorForge</span>
                        </div>
                        <p className="text-white/80 text-center">Crafting Culinary Experiences</p>
                    </div>

                    {/* Welcome Message */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                        <p className="text-xl text-white/90 leading-relaxed max-w-md">
                            Ready to continue your culinary journey? Sign in to discover amazing flavors and connect with top restaurants.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-6 max-w-sm w-full">
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <Star className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Premium Quality</h3>
                                <p className="text-sm text-white/70">Top-rated restaurants</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Fast Delivery</h3>
                                <p className="text-sm text-white/70">Quick & reliable service</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Community</h3>
                                <p className="text-sm text-white/70">Join food enthusiasts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="mb-4">
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r h-11 from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    FlavorForge
                                </h1>
                                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-2 rounded-full"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                            <p className="text-gray-600">Access your culinary world</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-4 font-medium bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            
                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-4 font-medium bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* OTP Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    One-Time Password (OTP)
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 text-gray-400" />
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-32 py-4 font-medium bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || otpTimer > 0}
                                        className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {otpLoading ? (
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                                                <span className="hidden sm:inline">Sending</span>
                                            </div>
                                        ) : otpTimer > 0 ? (
                                            <span className="text-xs">{otpTimer}s</span>
                                        ) : otpSent ? (
                                            <span className="text-xs">Resend</span>
                                        ) : (
                                            <span className="text-xs">Send OTP</span>
                                        )}
                                    </button>
                                </div>
                                {otpSent && otpTimer === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">Didn't receive? Click resend</p>
                                )}
                            </div>
                            
                            {/* Login Button */}
                            <button
                                onClick={handleLogin}
                                disabled={loginCustomerMutation.isPending}
                                type='submit'
                                className="w-full cursor-pointer py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg group"
                            >
                                {loginCustomerMutation.isPending ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                          Sign In
                                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                    </div>
                                )}
                            </button>
                        </form>
                          
                        {/* Footer Links */}
                        <div className="mt-8 text-center space-y-4">
                            <Link to={"/forgot-password"} className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200">
                                Forgot your password?
                            </Link>
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <span className="text-gray-600">Don't have an account?</span>
                                <Link to={"/customer/signup"} className="text-orange-600 hover:text-orange-700 hover:underline font-semibold transition-colors duration-200">
                                      Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLoginPage;