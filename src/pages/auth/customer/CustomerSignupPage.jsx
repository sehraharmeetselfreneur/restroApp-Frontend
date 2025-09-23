import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, Calendar, MapPin, Camera, ChevronDown, ArrowRight, ArrowLeft, Sparkles, Shield, Heart, CheckCircle2, Navigation, Target } from 'lucide-react';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { MdLocationOn, MdCake, MdVerifiedUser } from 'react-icons/md';
import { IoRestaurantOutline, IoGiftOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerCustomer } from '../../../api/customerApi';
import validator from 'validator';

const CustomerSignupPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("customerSignupForm");
        return saved
            ? JSON.parse(saved)
            : {
                customerName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                dob: "",
                gender: "",
                address: {
                    street: "",
                    city: "",
                    state: "",
                    pincode: "",
                    landmark: "",
                    tag: "",
                    geoLocation: { lat: null, lng: null },
                },
                profileImage: null
              };
    });
    const [profileImage, setProfileImage] = useState(null);
    const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = localStorage.getItem("restaurantCurrentStep");
        return savedStep ? Number(savedStep) : 1;
    });

    useEffect(() => {
        localStorage.setItem("customerSignupForm", JSON.stringify(formData));
    }, [formData]);
    useEffect(() => {
        localStorage.setItem("customerCurrentStep", currentStep);
    }, [currentStep]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    const registerCustomerMutation = useMutation({
        mutationFn: registerCustomer,
        onSuccess: () => {
            toast.success("Registration successful!");
            localStorage.removeItem("customerSignupForm");
            localStorage.removeItem("customerCurrentStep");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...(prev[parent] || {}), [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by this browser');
            return;
        }

        setIsGettingLocation(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        geoLocation: {
                            lat: latitude,
                            lng: longitude
                        }
                    },
                    locationPermission: true
                }));
                setIsGettingLocation(false);
            },
            (error) => {
                let errorMessage = 'Failed to get location. Please try again.';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }

                setLocationError(errorMessage);
                setIsGettingLocation(false);
                toast.error(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const validateStep = (step) => {
        if (step === 1) {
            if (!formData.customerName.trim()) {
                toast.error('Please enter your full name');
                return false;
            }
            if (!formData.email) {
                toast.error("Email is required");
            }
            else{
                if(!validator.isEmail(formData.email)){
                    toast.error("Enter a valid email address");
                    return false;
                }
                else{
                    const domain = (formData.email.split("@")[1] || "").toLowerCase();
                    const parts = domain.split(".");
                    if(parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]){
                        toast.error("Enter a valid email address");
                        return false;
                    }
                }
            }
            if (!formData.phone?.trim()){
                toast.error("Phone number is required");
                return false;
            }
            else if (!/^[6-9]\d{9}$/.test(formData.phone)){
                toast.error("Enter a valid 10-digit phone");
                return false;
            }

            // Password
            if (!formData.password) {
                toast.error("Password is required");
                return false;
            } else {
                if (formData.password.length < 8) {
                    toast.error("Password must be at least 8 characters long");
                    return false;
                } else if (!/[A-Z]/.test(formData.password)) {
                    toast.error("Password must contain at least one uppercase letter");
                    return false;
                } else if (!/[a-z]/.test(formData.password)) {
                    toast.error("Password must contain at least one lowercase letter");
                    return false;
                } else if (!/[0-9]/.test(formData.password)) {
                    toast.error("Password must contain at least one number");
                    return false;
                } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
                    toast.error("Password must contain at least one special character");
                    return false;
                }
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return false;
            }
        }
        
        if (step === 2) {
            if (!formData.dob) {
                toast.error('Please select your date of birth');
                return false;
            }
            if (!formData.gender) {
                toast.error('Please select your gender');
                return false;
            }
        }

        if (step === 3) {
            if (!formData.address?.street?.trim()) {
                toast.error('Street address is required');
                return false;
            }
            if (!formData.address?.city?.trim()) {
                toast.error('City is required');
                return false;
            }
            if (!formData.address?.pincode?.trim()) {
                toast.error('Pincode is required');
                return false;
            }
        }

        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const benefits = [
        { icon: IoRestaurantOutline, text: 'Order from 1000+ restaurants', color: 'text-orange-500' },
        { icon: IoGiftOutline, text: 'Exclusive deals & offers', color: 'text-pink-500' },
        { icon: MdVerifiedUser, text: 'Secure & fast delivery', color: 'text-green-500' },
        { icon: Heart, text: 'Save your favorite dishes', color: 'text-red-500' }
    ];

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 transform ${
                        step === currentStep 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl scale-110' 
                            : step < currentStep 
                                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}>
                        {step < currentStep ? (
                            <CheckCircle2 className="w-6 h-6" />
                        ) : (
                            <span className="font-bold">{step}</span>
                        )}
                        {step === currentStep && (
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse opacity-30"></div>
                        )}
                    </div>
                    {step < 3 && (
                        <div className={`w-20 h-1 mx-4 transition-all duration-500 rounded-full ${
                            step < currentStep ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-700 font-medium text-sm">Personal Information</span>
                </div>
                <h2 className="text-3xl lg:text-4xl h-11 font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                    Let's get to know you
                </h2>
                <p className="text-gray-600 text-lg">Create your personalized food journey</p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                        {profileImage ? (
                            <img src={profileImage instanceof File ? (URL.createObjectURL(profileImage)) : profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-12 h-12 text-white" />
                        )}
                        {!profileImage && 
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-3 shadow-lg border-4 border-white">
                        <Camera className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300">
                        <User className="w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="w-full pl-14 pr-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300">
                        <Mail className="w-6 h-6" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        className="w-full pl-14 pr-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300">
                        <Phone className="w-6 h-6" />
                    </div>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="w-full pl-14 pr-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300">
                        <Lock className="w-6 h-6" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full pl-14 pr-14 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-300"
                    >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                </div>

                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300">
                        <Shield className="w-6 h-6" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className="w-full pl-14 pr-14 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-300"
                    >
                        {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
                    <MdCake className="w-4 h-4 text-purple-500" />
                    <span className="text-purple-700 font-medium text-sm">Personal Details</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                    Tell us about yourself
                </h2>
                <p className="text-gray-600 text-lg">Help us personalize your experience</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
                        <User className="w-6 h-6" />
                    </div>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg appearance-none cursor-pointer"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 pointer-events-none" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Why we need this information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Age-appropriate recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Personalized offers</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Better customer service</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        <span className="text-gray-600 text-sm">Special birthday treats</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full mb-6">
                    <MdLocationOn className="w-4 h-4 text-green-500" />
                    <span className="text-green-700 font-medium text-sm">Delivery Address</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                    Where can we deliver?
                </h2>
                <p className="text-gray-600 text-lg">Add your address for seamless delivery</p>
            </div>

            {/* Geolocation Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Get Your Current Location</h3>
                        <p className="text-gray-600 text-sm">For faster and accurate delivery</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation || formData.locationPermission}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        formData.locationPermission
                            ? 'bg-green-100 text-green-700 border-2 border-green-200 cursor-not-allowed'
                            : isGettingLocation
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                    }`}
                >
                    {isGettingLocation ? (
                        <>
                            <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                            Getting Location...
                        </>
                    ) : formData.locationPermission ? (
                        <>
                            <Target className="w-5 h-5" />
                            Location Captured ✓
                        </>
                    ) : (
                        <>
                            <Navigation className="w-5 h-5" />
                            Get Current Location
                        </>
                    )}
                </button>

                {formData.locationPermission && formData.address?.geoLocation && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                            <Target className="w-4 h-4" />
                            Location: {formData.address.geoLocation.lat.toFixed(6)}, {formData.address.geoLocation.lng.toFixed(6)}
                        </div>
                    </div>
                )}

                {locationError && (
                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-red-700 text-sm font-medium">{locationError}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="relative group">
                    <div className="absolute left-4 top-6 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <textarea
                        name="address.street"
                        value={formData.address?.street || ''}
                        onChange={handleInputChange}
                        placeholder="Street Address, House/Flat Number"
                        rows="3"
                        className="w-full pl-14 pr-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="address.city"
                        value={formData.address?.city || ''}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                    <input
                        type="text"
                        name="address.state"
                        value={formData.address?.state || ''}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full px-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="address.pincode"
                        value={formData.address?.pincode || ''}
                        onChange={handleInputChange}
                        placeholder="Pincode"
                        className="w-full px-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                    <input
                        type="text"
                        name="address.landmark"
                        value={formData.address?.landmark || ''}
                        onChange={handleInputChange}
                        placeholder="Landmark (Optional)"
                        className="w-full px-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg"
                    />
                </div>

                <div className="relative group">
                    <select
                        name="address.tag"
                        value={formData.address?.tag || 'Home'}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 font-medium bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg hover:border-gray-300 hover:shadow-lg appearance-none cursor-pointer"
                    >
                        <option value="Home">🏠 Home</option>
                        <option value="Work">🏢 Work</option>
                        <option value="Other">📍 Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 pointer-events-none" />
                </div>
            </div>
        </div>
    );

    const handleSubmit = () => {
        if (validateStep(3)) {
            console.log(formData);
            registerCustomerMutation.mutate(formData);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 via-pink-50 to-purple-50 relative overflow-hidden">

            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-bl from-orange-200/40 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-red-200/40 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-4 h-4 bg-orange-300 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-40 right-32 w-3 h-3 bg-red-300 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-32 left-16 w-5 h-5 bg-pink-300 rounded-full opacity-60 animate-bounce" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-300 rounded-full opacity-60 animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            <div className="relative z-10 min-h-screen">
                {/* Desktop Layout */}
                <div className="hidden lg:flex h-screen">
                    {/* Left Side - Benefits & Branding (Sticky) */}
                    <div className="w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center relative overflow-hidden sticky top-0 h-screen">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 text-white max-w-lg p-12">
                            <div className="mb-8">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                    <IoRestaurantOutline className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold mb-4 leading-tight">
                                    FlavorForge
                                </h1>
                                <p className="text-xl opacity-90 leading-relaxed">
                                    Discover amazing restaurants, enjoy exclusive deals, and get your favorite food delivered in minutes.
                                </p>
                            </div>
                            
                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div 
                                        key={index}
                                        className="flex select-none items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 transform transition-all duration-300 hover:bg-white/20"
                                        style={{animationDelay: `${index * 0.2}s`}}
                                    >
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-lg font-medium">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-lg opacity-75 mb-4">Join over 1M+ happy customers</p>
                                <div className="flex justify-center space-x-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form (Scrollable) */}
                    <div className="w-1/2 overflow-y-auto">
                    {/* Right Side - Form (Scrollable) */}
                    <div className="w-full overflow-y-auto">
                        <div className="min-h-screen flex items-center justify-center p-12">
                            <div className="w-full max-w-lg py-3">
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
                                    {renderStepIndicator()}
                                    <div>
                                        {currentStep === 1 && renderStep1()}
                                        {currentStep === 2 && renderStep2()}
                                        {currentStep === 3 && renderStep3()}

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between items-center mt-10">
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                                    className="flex items-center cursor-pointer gap-3 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                    Previous
                                                </button>
                                            )}
                                            
                                            {currentStep < 3 ? (
                                                <button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="flex items-center cursor-pointer gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg ml-auto group"
                                                >
                                                    Next
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={isLoading}
                                                    className="flex items-center cursor-pointer gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg ml-auto disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {registerCustomerMutation.isPending ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Creating Account...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Create Account
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Social Login Options */}
                                <div className="mt-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-gray-50 text-gray-500 rounded-full">Or continue with</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <button className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 group">
                                            <FaGoogle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                                        </button>
                                        <button className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                                            <FaFacebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                        </button>
                                        <button className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 group">
                                            <FaApple className="w-5 h-5 text-gray-800 group-hover:scale-110 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Login Link */}
                                <div className="text-center mt-8 mb-12">
                                    <p className="text-gray-600 text-lg">
                                        Already have an account?{' '}
                                        <Link to={"/customer/login"} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300 hover:underline">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo/Brand Section */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                                <IoRestaurantOutline className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                                FoodieHub
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Join millions who order their favorite food with us
                            </p>

                            {/* Mobile Benefits */}
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                {benefits.slice(0, 4).map((benefit, index) => (
                                    <div 
                                        key={index}
                                        className="bg-white/60 backdrop-blur-md rounded-xl p-3 text-center border border-white/30"
                                    >
                                        <benefit.icon className={`w-6 h-6 mx-auto mb-2 ${benefit.color}`} />
                                        <p className="text-xs text-gray-700 font-medium">{benefit.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Form Card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                            {renderStepIndicator()}
                            
                            <div>
                                {currentStep === 1 && renderStep1()}
                                {currentStep === 2 && renderStep2()}
                                {currentStep === 3 && renderStep3()}

                                {/* Mobile Navigation Buttons */}
                                <div className={`flex gap-4 items-center justify-center mt-8 ${currentStep === 3 ? "flex-col" : ""}`}>
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(prev => prev - 1)}
                                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            Previous
                                        </button>
                                    )}
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg group"
                                        >
                                            Continue
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-8 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    Create Account
                                                    <Sparkles className="w-6 h-6" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Social Login */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 text-gray-500 rounded-full">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <button className="flex items-center justify-center px-4 py-4 bg-white/80 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 group shadow-lg">
                                    <FaGoogle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                                <button className="flex items-center justify-center px-4 py-4 bg-white/80 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group shadow-lg">
                                    <FaFacebook className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                                <button className="flex items-center justify-center px-4 py-4 bg-white/80 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 group shadow-lg">
                                    <FaApple className="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Login Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300 hover:underline">
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSignupPage;