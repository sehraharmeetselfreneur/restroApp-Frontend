import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Crown, ShieldCheck, Users, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAdmin } from "../../../api/adminApi";

const AdminLoginPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("adminLoginForm");
        return saved
            ? JSON.parse(saved)
            : {
                email: "",
                password: ""
            }
    });

    const loginAdminMutation = useMutation({
        mutationFn: loginAdmin,
        onSuccess: () => {
            localStorage.removeItem("adminLoginForm");
            queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
            toast.success("Admin logged in successfully!");
            navigate("/admin");
        },
        onError: (error) => {
            toast.error(error.response.data?.message);
        }
    })

    useEffect(() => {
        localStorage.setItem("adminLoginForm", JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // Validate email
        if (!formData.email) {
            toast.error("Email is required");
            return;
        } else {
            if (!validator.isEmail(formData.email)) {
                toast.error("Enter a valid email address");
                return;
            }
            const domain = (formData.email.split("@")[1] || "").toLowerCase();
            const parts = domain.split(".");
            if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
                toast.error("Enter a valid email address");
                return;
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
            } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
                toast.error("Password must contain at least one special character");
                return;
            }
        }

        loginAdminMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Display Section */}
            <div className="hidden lg:flex lg:w-1/2 justify-center items-center select-none bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full -translate-y-48 translate-x-48"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full translate-y-40 -translate-x-40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    {/* Logo/Brand */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                            <span
                                onClick={() => navigate("/")}
                                className="text-3xl font-bold cursor-pointer"
                            >
                                Admin Portal
                            </span>
                        </div>
                        <p className="text-white/80 text-center">Secure Access for Administrators</p>
                    </div>

                    {/* Welcome Message */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Welcome Back, Admin!</h1>
                        <p className="text-lg text-white/90 leading-relaxed max-w-md">
                            Sign in to manage your platform, oversee operations, and ensure everything runs smoothly.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-6 max-w-sm w-full">
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Secure Access</h3>
                                <p className="text-sm text-white/70">Encrypted authentication</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <Star className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Premium Control</h3>
                                <p className="text-sm text-white/70">Full admin privileges</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Team Oversight</h3>
                                <p className="text-sm text-white/70">Manage users efficiently</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="mb-4">
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r h-11 from-slate-900 to-indigo-700 bg-clip-text text-transparent">
                                    Admin Panel
                                </h1>
                                <div className="w-20 h-1 bg-gradient-to-r from-slate-800 to-indigo-600 mx-auto mt-2 rounded-full"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                            <p className="text-gray-600">Restricted Access - Admins Only</p>
                        </div>

                            {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-4 font-medium bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all duration-200"
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
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-4 font-medium bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 transition-all duration-200"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-slate-700 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                                {/* Login Button */}
                            <button
                                onClick={handleLogin}
                                type="submit"
                                disabled={loginAdminMutation.isPending}
                                className="w-full cursor-pointer py-4 px-6 bg-gradient-to-r from-slate-800 to-indigo-700 text-white font-semibold rounded-xl hover:from-slate-900 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-slate-600/20 transition-all duration-200 transform hover:scale-105 shadow-lg group"
                            >
                                {loginAdminMutation.isPending ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        Sign in
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
