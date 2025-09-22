import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Upload, Shield, User, Mail, Phone, Lock, Users, Camera, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerAdmin } from '../../../api/adminApi';

const AdminSignupPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem("adminSignupForm"); // Fixed: use same key
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure permissions array always exists
                return {
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                    role: 'Admin',
                    permissions: [],
                    profileImage: null,
                    ...parsed, // Override with saved data
                    permissions: parsed.permissions || [] // Ensure permissions is always an array
                };
            }
        }
        catch(error){
            console.error("Error parsing saved data:", error);
            localStorage.removeItem("adminSignupForm");
        }

        // Default state if no saved data or parsing fails
        return {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            role: 'Admin',
            permissions: [],
            profileImage: null
        };
    });

    useEffect(() => {
        localStorage.setItem("adminSignupForm", JSON.stringify(formData));
    }, [formData]);

    const [profileImage, setProfileImage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const registerAdminMutation = useMutation({
        mutationFn: registerAdmin,
        onSuccess: () => {
            toast.success("Admin registered successfully");
            localStorage.removeItem("adminSignupForm");
            queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
            navigate("/admin");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })

    const permissionOptions = [
        { value: 'manage_restaurants', label: 'Manage Restaurants', icon: '🏪', desc: 'Full restaurant control' },
        { value: 'manage_customers', label: 'Manage Customers', icon: '👥', desc: 'Customer management' },
        { value: 'manage_orders', label: 'Manage Orders', icon: '📦', desc: 'Order processing' },
        { value: 'manage_payments', label: 'Manage Payments', icon: '💳', desc: 'Payment handling' },
        { value: 'manage_coupons', label: 'Manage Coupons', icon: '🎟️', desc: 'Coupon management' },
        { value: 'view_analytics', label: 'View Analytics', icon: '📊', desc: 'Analytics dashboard' },
        { value: 'handle_tickets', label: 'Handle Tickets', icon: '🎫', desc: 'Support tickets' }
    ];

    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                if (!value.trim()) {
                    toast.error('Full name is required');
                    return false;
                }
                if (value.trim().length < 2) {
                    toast.error('Full name must be at least 2 characters');
                    return false;
                }
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    toast.error('Full name can only contain letters and spaces');
                    return false;
                }
                return true;

            case 'email':
                if (!value) {
                    toast.error("Email is required");
                    return false;
                }
                else{
                    if(!validator.isEmail(value)){
                        toast.error("Enter a valid email address");
                        return false;
                    }
                    else{
                        const domain = (value.split("@")[1] || "").toLowerCase();
                        const parts = domain.split(".");
                        if(parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]){
                            toast.error("Enter a valid email address");
                            return false;
                        }
                    }
                }
                return true;

            case 'password':
                if (!value) {
                    toast.error("Password is required");
                    return false;
                } else {
                    if (value.length < 8) {
                        toast.error("Password must be at least 8 characters long");
                        return false;
                    } else if (!/[A-Z]/.test(value)) {
                        toast.error("Password must contain at least one uppercase letter");
                        return false;
                    } else if (!/[a-z]/.test(value)) {
                        toast.error("Password must contain at least one lowercase letter");
                        return false;
                    } else if (!/[0-9]/.test(value)) {
                        toast.error("Password must contain at least one number");
                        return false;
                    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                        toast.error("Password must contain at least one special character");
                        return false;
                    }
                }
                return true;

            case 'confirmPassword':
                if (!value) {
                    toast.error('Please confirm your password');
                    return false;
                }
                if (value !== formData.password) {
                    toast.error('Passwords do not match');
                    return false;
                }
                return true;

            case 'phone':
                if (!value?.trim()){
                    toast.error("Phone number is required");
                    return false;
                }
                else if (!/^[6-9]\d{9}$/.test(value)){
                    toast.error("Enter a valid 10-digit phone");
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionToggle = (permission) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file');
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profileImage: file
                }));
                setProfileImage(file);
            };
        }
    };

    const validateForm = () => {
        const fields = ['fullName', 'email', 'password', 'confirmPassword', 'phone'];
        
        for (let field of fields) {
            if (!validateField(field, formData[field])) {
                return false;
            }
        }

        if (formData.permissions.length === 0) {
            toast.error('Please select at least one permission');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        console.log(formData);

        const submissionData = new FormData();
        submissionData.append("adminName", formData.fullName);
        submissionData.append("email", formData.email);
        submissionData.append("password", formData.password);
        submissionData.append("phone", formData.phone);
        submissionData.append("role", formData.role);
        formData.permissions.forEach(p => submissionData.append("permissions[]", p));

        if (formData.profileImage) {
            submissionData.append("profileImage", formData.profileImage);
        }

        registerAdminMutation.mutate(submissionData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <Shield size={28} />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold">Create Admin Account</h1>
                                    <p className="text-orange-100 mt-1">Set up administrator access with custom permissions</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
                        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>

                    <div className="p-8 lg:p-12">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Profile Section */}
                            <div className="xl:col-span-1 space-y-6">
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <User size={20} className="text-orange-500" />
                                        Profile Setup
                                    </h3>
                                    
                                    {/* Profile Image Upload */}
                                    <div className="text-center mb-6">
                                        <div className="relative inline-block group">
                                            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                                                {formData.profileImage ? (
                                                    <img 
                                                        src={profileImage 
                                                                ? URL.createObjectURL(profileImage) 
                                                                : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="} 
                                                        alt="Profile" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={36} />
                                                )}
                                            </div>
                                            <label className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 group-hover:shadow-xl">
                                                <Camera size={16} />
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-3">Upload profile picture</p>
                                        <p className="text-xs text-gray-500">Max 5MB • JPG, PNG</p>
                                    </div>

                                    {/* Role Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            <Star size={16} className="inline mr-2 text-orange-500" />
                                            Admin Role
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 cursor-pointer border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all hover:border-orange-300 bg-white"
                                        >
                                            <option value="Admin" className='cursor-pointer'>Admin</option>
                                            <option value="SuperAdmin" className='cursor-pointer'>Super Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="xl:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            <User size={16} className="inline mr-2 text-orange-500" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-4 border-2 font-medium border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all hover:border-gray-300 hover:shadow-md"
                                            placeholder="Enter full name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            <Mail size={16} className="inline mr-2 text-orange-500" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-4 border-2 font-medium border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all hover:border-gray-300 hover:shadow-md"
                                            placeholder="admin@restaurant.com"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            <Phone size={16} className="inline mr-2 text-orange-500" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-4 border-2 font-medium border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all hover:border-gray-300 hover:shadow-md"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            <Lock size={16} className="inline mr-2 text-orange-500" />
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-4 pr-12 border-2 font-medium border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all hover:border-gray-300 hover:shadow-md"
                                                placeholder="Create strong password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            <Lock size={16} className="inline mr-2 text-orange-500" />
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-4 pr-12 border-2 font-medium border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all hover:border-gray-300 hover:shadow-md"
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                                    <Shield size={24} className="text-orange-500" />
                                    Admin Permissions
                                </h3>
                                <p className="text-gray-600 max-w-2xl mx-auto">Choose the specific permissions this admin will have. You can modify these later from the admin management panel.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {permissionOptions.map((permission) => (
                                    <div
                                        key={permission.value}
                                        onClick={() => handlePermissionToggle(permission.value)}
                                        className={`group p-5 rounded-2xl select-none border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                                            formData.permissions.includes(permission.value)
                                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-md'
                                                : 'border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50/50'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`text-3xl mb-3 p-3 rounded-xl transition-all ${
                                                formData.permissions.includes(permission.value)
                                                    ? 'bg-orange-100'
                                                    : 'bg-gray-50 group-hover:bg-orange-100'
                                            }`}>
                                                {permission.icon}
                                            </div>
                                            <h4 className="font-semibold text-gray-800 mb-1">{permission.label}</h4>
                                            <p className="text-xs text-gray-500 mb-3">{permission.desc}</p>
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                formData.permissions.includes(permission.value)
                                                    ? 'bg-orange-500 border-orange-500 scale-110'
                                                    : 'border-gray-300 group-hover:border-orange-400'
                                            }`}>
                                                {formData.permissions.includes(permission.value) && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                        <polyline points="20,6 9,17 4,12"></polyline>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={registerAdminMutation.isPending}
                                className={`w-full py-5 px-8 cursor-pointer rounded-2xl font-bold text-white text-lg transition-all ${
                                    registerAdminMutation.isPending
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl'
                                }`}
                            >
                                {registerAdminMutation.isPending ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Admin Account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        <Shield size={20} />
                                        Create Admin Account
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSignupPage;