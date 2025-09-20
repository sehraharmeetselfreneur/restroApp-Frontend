import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import validator from 'validator';

//Icons and Toast notification
import { FaUtensils, FaFileUpload, FaClock, FaFileAlt, FaCheckCircle, FaArrowRight, FaTimes, FaCamera, FaPlus, FaUser, FaRegCreditCard, FaBuilding, FaMobile, FaEyeSlash, FaEye } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdRestaurant, MdImage, MdAccessTime, MdDescription, MdOutlineWifiPassword } from "react-icons/md";
import { CiBank } from "react-icons/ci";
import toast from "react-hot-toast";

//API functions
import { registerRestaurant } from "../../api/restaurantApi";

//Components
import MobileStepIndicator from '../../components/auth/MobileStepIndicator';
import VerticalStepNavigation from "../../components/auth/VerticalStepNavigation";

const steps = [
    { 
        id: 1, 
        label: "Basic Information", 
        icon: <MdRestaurant />, 
        description: "Restaurant details & contact" 
    },
    { 
        id: 2, 
        label: "Address & Location", 
        icon: <MdLocationOn />, 
        description: "Where customers find you" 
    },
    { 
        id: 3, 
        label: "Images & Gallery", 
        icon: <MdImage />, 
        description: "Showcase your restaurant" 
    },
    { 
        id: 4, 
        label: "Legal Documents", 
        icon: <FaFileAlt />, 
        description: "Licenses & certificates" 
    },
    { 
        id: 5, 
        label: "Operating Hours", 
        icon: <MdAccessTime />, 
        description: "When you're open" 
    },
    { 
        id: 6, 
        label: "Bank Details", 
        icon: <CiBank />,
        description: "Account details for payments" 
    },
];

// ---------------- VALIDATIONS ----------------
const validateStep1 = (data) => {
    const errors = {};
    if (!data.restaurantName?.trim()) errors.restaurantName = "Restaurant name is required";
    if (!data.email) {
        errors.email = "Email is required";
    }
    else{
        if(!validator.isEmail(data.email)){
            errors.email = "Enter a valid email address";
        }
        else{
            const domain = (data.email.split("@")[1] || "").toLowerCase();
            const parts = domain.split(".");
            if(parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]){
                errors.email = "Enter a valid email address";
            }
        }
    }
    // Password
    if (!data.password) {
        errors.password = "Password is required";
    } else {
        if (data.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(data.password)) {
            errors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(data.password)) {
            errors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(data.password)) {
            errors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
            errors.password = "Password must contain at least one special character";
        }
    }
    if (data.cuisines.length === 0) errors.cuisines = "At least one cuisine is required";
    return errors;
};
const validateStep2 = (formData) => {
    const errors = {};
    if (!formData.address.street?.trim()) errors.street = "Street is required";
    if (!formData.phone?.trim()) errors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errors.phone = "Enter a valid 10-digit phone";
    if (!formData.address.city?.trim()) errors.city = "City is required";
    if (!formData.address.state?.trim()) errors.state = "State is required";
    if (!formData.address.pincode?.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.address.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
    return errors;
};
const validateStep3 = (images) => {
    const errors = {};
    if (images.length === 0) errors.images = "At least one image is required";
    return errors;
};
const validateStep4 = (documents, formData) => {
    const errors = {};
    
    if (!formData.licenseNumber.fssai) {
        errors.fssai = "FSSAI License Number is required";
    }
    else if (!/^[1-5]\d{13}$/.test(formData.licenseNumber.fssai)) {
        errors.fssai = "Enter a valid 14-digit FSSAI License Number";
    }
    if (!formData.licenseNumber.gst) {
        errors.gst = "GST Number is required";
    }
    else if (!/^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.licenseNumber.gst)) {
        errors.gst = "Enter a valid 15-character GST Number";
    }
    if (!documents.fssaiLicense) errors.fssaiLicense = "FSSAI License upload is required";
    if (!documents.gstCertificate) errors.gstCertificate = "GST Certificate upload is required";
    if (!documents.panCard) errors.panCard = "PAN Card upload is required";
    return errors;
};
const validateStep5 = (formData) => {
    const errors = {};

    if (!formData.openingTime) {
        errors.openingTime = "Opening time is required";
    }
    if (!formData.closingTime) {
        errors.closingTime = "Closing time is required";
    }

    if (formData.openingTime && formData.closingTime) {
        const open = new Date(`1970-01-01T${formData.openingTime}:00`);
        const close = new Date(`1970-01-01T${formData.closingTime}:00`);
        
        if (close <= open) {
            errors.closingTime = "Closing time must be later than opening time";
        }
    }

    return errors;
}
const validateStep6 = (bankDetails) => {
    const errors = {};

    if (!bankDetails.accountHolderName.trim()) {
        errors.accountHolderName = "Account holder name is required";
    }
    if (!bankDetails.accountNumber.trim()) {
        errors.accountNumber = "Account number is required";
    }
    else if (!/^\d{9,18}$/.test(bankDetails.accountNumber)) {
        errors.accountNumber = "Account number must be 9–18 digits";
    }
    if (!bankDetails.IFSC.trim()) {
        errors.IFSC = "IFSC code is required";
    }
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.IFSC)) {
        errors.IFSC = "Enter a valid IFSC code";
    }
    if (!bankDetails.bankName.trim()) {
        errors.bankName = "Bank name is required";
    }
    if(bankDetails.upi_id){
        if (!bankDetails.upi_id.trim()) {
            errors.upi_id = "UPI ID is required";
        }
        else if (!/^[\w.-]+@[\w.-]+$/.test(bankDetails.upi_id)) {
            errors.upi_id = "Enter a valid UPI ID";
        }
    }

    return errors;
};

const RestaurantSignupPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = localStorage.getItem("restaurantCurrentStep");
        return savedStep ? Number(savedStep) : 1;
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("restaurantForm");
        return saved
            ? JSON.parse(saved)
            :   {
                    restaurantName: "",
                    description: "",
                    cuisines: [],
                    phone: "",
                    email: "",
                    password: "",
                    address: {
                        street: "",
                        city: "",
                        state: "",
                        pincode: "",
                        geoLocation: { lat: null, lng: null },
                    },
                    licenseNumber: { fssai: "", gst: "" },
                    openingTime: "",
                    closingTime: "",
                    images: [],
                    documents: { fssaiLicense: null, gstCertificate: null, panCard: null },
                    bankDetails: {
                        accountHolderName: "",
                        accountNumber: "",
                        IFSC: "",
                        bankName: "",
                        upi_id: ""
                    }
                };
    });

    const [cuisineInput, setCuisineInput] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);
    const [documents, setDocuments] = useState({
        fssaiLicense: null,
        gstCertificate: null,
        panCard: null
    });
    const fileInputRef = useRef(null);
    const documentInputRefs = useRef({ fssai: null, gst: null, pan: null });

    //UseEffects for saving data in localStorage
    useEffect(() => {
        localStorage.setItem("restaurantForm", JSON.stringify(formData));
    }, [formData]);
    useEffect(() => {
        localStorage.setItem("restaurantCurrentStep", currentStep);
    }, [currentStep]);

    // Mutation for registering restaurant
    const registerRestaurantMutation = useMutation({
        mutationFn: registerRestaurant,
        onSuccess: (data) => {
            toast.success("Restaurant registered successfully!");
            localStorage.removeItem("restaurantForm");
            localStorage.removeItem("restaurantCurrentStep");
            queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
            // Navigate to dashboard
            setTimeout(() => {
                navigate("/restaurant/dashboard");
            }, 100);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })

    //For validating the left side navigation bar
    const validateCurrentStep = () => {
        switch(currentStep) {
            case 1: return validateStep1(formData);
            case 2: return validateStep2(formData.address);
            case 3: return validateStep3(formData.images);
            case 4: return validateStep4(documents, formData);
            case 5: return validateStep5(formData);
            case 6: return validateStep6(formData.bankDetails);
            default: return {};
        }
    };
    
    //Validation error for every step and updation to next step
    const nextStep = () => {
        let errors = {};
        if(currentStep === 1) errors = validateStep1(formData);
        if(currentStep === 2) errors = validateStep2(formData);
        if(currentStep === 3) errors = validateStep3(formData.images);
        if(currentStep === 4) errors = validateStep4(documents, formData);
        if(currentStep === 5) errors = validateStep5(formData);
        if(currentStep === 6) errors = validateStep6(formData.bankDetails);

        setFormErrors(errors);

        if (Object.keys(errors).length === 0 && currentStep < 6) {
            setCurrentStep((prev) => prev + 1);
        }
        else{
            toast.error(Object.values(errors)[0]);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleDocumentUpload = (documentType, event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload only PDF, JPEG, or PNG files.');
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                toast.error('File size should be less than 5MB.');
                return;
            }

            setDocuments(prev => ({ ...prev, [documentType]: file }));

            // Also update the main formData if needed
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [documentType]: file
                }
            }));
        }
    };

    const removeDocument = (documentType) => {
        setDocuments(prev => ({
            ...prev,
            [documentType]: null
        }));

        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [documentType]: null }
        }));

        // Clear the file input
        if (documentInputRefs.current[documentType]) {
            documentInputRefs.current[documentType].value = '';
        }
    };

    const triggerDocumentUpload = (documentType) => {
        const inputRef = documentInputRefs.current[documentType];
        if (inputRef) {
            inputRef.click();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleStepClick = (stepId) => {
        setCurrentStep(stepId);
    };

    //Input value change with nested objects also
    const handleInputChange = useCallback((field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...(prev[parent] || {}), [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    }, []);

    const addCuisine = () => {
        if (cuisineInput.trim() && !formData.cuisines.includes(cuisineInput.trim())) {
            setFormData(prev => ({
                ...prev,
                cuisines: [...prev.cuisines, cuisineInput.trim()]
            }));
            setCuisineInput('');
        }
    };

    const removeCuisine = (cuisine) => {
        setFormData(prev => ({
            ...prev,
            cuisines: prev.cuisines.filter(c => c !== cuisine)
        }));
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]  // store as File[]
        }));
    };

    const getMyLocation = () => {
        setLocationLoading(true);
        
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Update form data with coordinates
                setFormData(prev => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        geoLocation: {
                            lat: latitude,
                            lng: longitude
                        }
                    }
                }));
                
                setLocationLoading(false);
                toast.success(`Location captured successfully!`);
            },
            (error) => {
                setLocationLoading(false);
                let errorMessage = 'Unable to get your location. ';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied. Please enable location services and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateStep6(formData.bankDetails);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0){
            toast.error(Object.values(errors)[0]);
            return;
        }
        console.log(formData);

        //Mutation calling the API
        registerRestaurantMutation.mutate({ formData, documents });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-300 via-white to-slate-800 p-2 md:p-8">
            <div className="max-w-full flex flex-col lg:flex-row gap-5">
                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-5 flex-1">
                    {/* Left Sidebar - Vertical Steps (Hidden on mobile) */}
                    <div className="hidden lg:block">
                        <VerticalStepNavigation 
                            currentStep={currentStep} 
                            steps={steps} 
                            onStepClick={handleStepClick}
                            validateCurrentStep={validateCurrentStep}
                        />
                    </div>

                    {/* Mobile Step Indicator (Visible only on mobile) */}
                    <div className="lg:hidden">
                        <MobileStepIndicator currentStep={currentStep} steps={steps} />
                    </div>

                    {/* Middle Content - Scrollable Form */}
                    <div className="flex-1 bg-white rounded-xl lg:rounded-2xl lg:min-w-3xl shadow-xl border border-slate-200 overflow-y-auto h-fit">
                        <div className="p-4 lg:p-7 flex flex-col">
                            <div className="min-h-[68vh]">
                                {currentStep === 1 && (
                                    <div className="space-y-8">
                                        <div className="border-b border-slate-200 pb-6">
                                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Restaurant Details</h2>
                                            <p className="text-slate-600">Tell us about your restaurant and how to reach you</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Restaurant Name */}
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                    <MdRestaurant />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Restaurant Name *"
                                                    value={formData.restaurantName}
                                                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                                                    className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                />
                                            </div>

                                            {/* Description */}
                                            <div className="relative group">
                                                <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                    <MdDescription />
                                                </div>
                                                <textarea
                                                    placeholder="Restaurant Description (Tell customers what makes you special)"
                                                    rows="4"
                                                    value={formData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 resize-none group-focus-within:shadow-md"
                                                />
                                            </div>

                                            {/* Cuisines */}
                                            <div className="space-y-4">
                                                <label className="block text-slate-700 font-semibold">Cuisines You Serve</label>
                                                <div className="flex gap-3">
                                                    <div className="relative group flex-1">
                                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                            <FaUtensils />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Add cuisine type (e.g., Italian, Chinese)"
                                                            value={cuisineInput}
                                                            onChange={(e) => setCuisineInput(e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCuisine())}
                                                            className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={addCuisine}
                                                        className="px-6 py-3 cursor-pointer font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center gap-2"
                                                    >
                                                        <FaPlus className="text-sm" />
                                                        Add
                                                    </button>
                                                </div>
                                                {formData.cuisines.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.cuisines.map((cuisine, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                                                            >
                                                                {cuisine}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeCuisine(cuisine)}
                                                                    className="text-orange-500 cursor-pointer hover:text-orange-700 transition-colors duration-200"
                                                                >
                                                                    <FaTimes className="text-xs" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Email and Phone */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <MdEmail />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        placeholder="Business Email *"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                      <MdOutlineWifiPassword />
                                                    </div>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Password *"
                                                        value={formData.password}
                                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                                        className="w-full p-4 pl-12 pr-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors duration-300"
                                                    >
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-8">
                                        <div className="border-b border-slate-200 pb-6">
                                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Restaurant Address</h2>
                                        <p className="text-slate-600">Where customers can find and visit your restaurant</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Street Address */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Street Address */}
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <MdLocationOn />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Street Address *"
                                                        value={formData.address.street}
                                                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                                                        className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                    />
                                                </div>

                                                {/* Contact Number */}
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <MdPhone />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        placeholder="Contact Number *"
                                                        value={formData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                    />
                                                </div>
                                            </div>

                                            {/* City, State, PIN */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <input
                                                    type="text"
                                                    placeholder="City *"
                                                    value={formData.address.city}
                                                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="State *"
                                                    value={formData.address.state}
                                                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="PIN Code *"
                                                    value={formData.address.pincode}
                                                    onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                                    <MdLocationOn className="mr-2" />
                                                    Location Services
                                                </h4>
                                                <p className="text-blue-700 text-sm mb-4">
                                                    We'll help customers find you with precise location mapping
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={getMyLocation}
                                                    disabled={locationLoading}
                                                    className={`px-4 py-2 text-white cursor-pointer font-bold rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                                                        locationLoading 
                                                        ? 'bg-gray-400 cursor-not-allowed' 
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {locationLoading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            Getting Location...
                                                        </>
                                                    ) : (
                                                        <>
                                                            📍 Get My Location
                                                        </>
                                                    )}
                                                </button>
                                                {/* Location Display Component */}
                                                {formData.address.geoLocation && formData.address.geoLocation.lat && formData.address.geoLocation.lng && (
                                                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-2">
                                                        <div className="flex items-center mb-2 gap-2">
                                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                            <h5 className="font-semibold text-green-800">Location Retrieved Successfully</h5>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                            <div className="bg-white flex items-center justify-between rounded-lg p-3 border border-green-100">
                                                                <span className="text-green-600 font-medium block mb-1">Latitude</span>
                                                                <span className="text-gray-800 font-bold font-mono text-xs">
                                                                    {formData.address.geoLocation.lat.toFixed(6)}°
                                                                </span>
                                                            </div>
                                                            <div className="bg-white flex items-center justify-between rounded-lg p-3 border border-green-100">
                                                                <span className="text-green-600 font-medium block mb-1">Longitude</span>
                                                                <span className="text-gray-800 font-bold font-mono text-xs">
                                                                    {formData.address.geoLocation.lng.toFixed(6)}°
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 text-xs text-green-700 flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            Coordinates captured for precise location mapping
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-8">
                                        <div className="border-b border-slate-200 pb-6">
                                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Restaurant Gallery</h2>
                                            <p className="text-slate-600">Upload high-quality images to attract customers</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 group cursor-pointer"
                                             onClick={() => fileInputRef.current?.click()}>
                                            <FaCamera className="mx-auto text-4xl text-slate-400 group-hover:text-orange-500 transition-colors duration-300 mb-4" />
                                            <h4 className="font-semibold text-slate-700 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                                                Upload Restaurant Images
                                            </h4>
                                            <p className="text-sm text-slate-500 mb-4">
                                                Click to browse or drag and drop images here
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Supported formats: JPG, PNG, WebP (Max 5MB each)
                                            </p>
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />

                                            {formData.images.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-slate-700 mb-4">Uploaded Images ({formData.images.length})</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {formData.images.map((image, index) => {
                                                            let imageUrl = "";
                                                            if (image instanceof File) {
                                                                imageUrl = URL.createObjectURL(image);
                                                            } else {
                                                                imageUrl = image; // maybe a URL or base64
                                                            }
                                                            return (
                                                                <div key={index} className="relative group">
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={`Restaurant ${index + 1}`}
                                                                        className="w-full h-32 object-cover rounded-xl shadow-md"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(index)}
                                                                        className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                                                                    >
                                                                        <FaTimes className="text-xs" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                                <h4 className="font-semibold text-green-800 mb-2">📸 Photo Tips</h4>
                                                <ul className="text-green-700 text-sm grid grid-cols-1">
                                                    <li>• Use natural lighting for food photos</li>
                                                    <li>• Show your restaurant's atmosphere and ambiance</li>
                                                    <li>• Include photos of popular dishes</li>
                                                    <li>• Clean, high-resolution images perform better</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-4">
                                        <div className="border-b border-slate-200 pb-6">
                                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Legal Documentation</h2>
                                            <p className="text-slate-600">Upload required licenses and certificates</p>
                                        </div>

                                        <div className="space-y-3">
                                            {/* License Numbers */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <input
                                                    type="text"
                                                    placeholder="FSSAI License Number *"
                                                    value={formData.licenseNumber.fssai}
                                                    onChange={(e) => handleInputChange('licenseNumber.fssai', e.target.value)}
                                                    className="w-full p-4 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="GST Number"
                                                    value={formData.licenseNumber.gst}
                                                    onChange={(e) => handleInputChange('licenseNumber.gst', e.target.value)}
                                                    className="w-full p-4 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                                <h4 className="font-semibold text-yellow-800 mb-2">📋 Required Documents</h4>
                                                <div className="space-y-3">
                                                    {[
                                                        { name: "FSSAI License", key: "fssaiLicense", inputRef: "fssai", required: true, desc: "Food Safety certification" },
                                                        { name: "GST Certificate", key: "gstCertificate", inputRef: "gst", required: false, desc: "Tax registration document" },
                                                        { name: "PAN Card", key: "panCard", inputRef: "pan", required: false, desc: "Business PAN verification" }
                                                    ].map((doc, index) => (
                                                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                                                            <div className="flex items-center justify-between ">
                                                                <div>
                                                                    <span className="font-medium text-slate-700">{doc.name}</span>
                                                                    {doc.required && (
                                                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Required</span>
                                                                    )}
                                                                    <p className="text-xs text-slate-500">{doc.desc}</p>
                                                                </div>
                                                                <div className="flex lg:flex-row flex-col items-center gap-2">
                                                                    {documents[doc.key] ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeDocument(doc.key)}
                                                                            className="px-3 py-2 cursor-pointer bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300 text-sm flex items-center gap-1"
                                                                        >
                                                                            <FaTimes className="text-xs" />
                                                                            Remove
                                                                        </button>
                                                                    ) : null}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => triggerDocumentUpload(doc.inputRef)}
                                                                        className="px-3 py-2 cursor-pointer bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-300 text-sm flex items-center gap-1"
                                                                    >
                                                                        <FaFileUpload className="text-xs" />
                                                                        {documents[doc.key] ? 'Change' : 'Upload'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* File Input */}
                                                            <input
                                                                ref={el => documentInputRefs.current[doc.inputRef] = el}
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={(e) => handleDocumentUpload(doc.key, e)}
                                                                className="hidden"
                                                            />
                                                            
                                                            {/* File Preview */}
                                                            {documents[doc.key] && (
                                                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                    <div className="flex items-center justify-between gap-3">
                                                                        <div className="flex-shrink-0">
                                                                            {documents[doc.key].type === 'application/pdf' ? (
                                                                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                                                    <span className="text-red-600 font-bold text-xs">PDF</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                                                    <span className="text-orange-400 font-bold text-xs">IMG</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-medium text-green-800 truncate">
                                                                                {documents[doc.key].name}
                                                                            </p>
                                                                            <p className="text-xs text-green-600">
                                                                                {(documents[doc.key].size / 1024 / 1024).toFixed(2)} MB
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex-shrink-0">
                                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                Uploaded
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <h5 className="font-medium text-blue-800 mb-1">Upload Guidelines:</h5>
                                                    <ul className="text-blue-700 grid lg:grid-cols-2 text-xs space-y-1">
                                                        <li>• Accepted formats: PDF, JPEG, PNG</li>
                                                        <li>• Maximum file size: 5MB</li>
                                                        <li>• Ensure documents are clear and readable</li>
                                                        <li>• All information should be clearly visible</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="space-y-8">
                                        <div className="border-b border-slate-200 pb-6">
                                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Operating Schedule</h2>
                                            <p className="text-slate-600">Set your restaurant's operating hours</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="block text-slate-700 font-semibold">Opening Time</label>
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                                                    <FaClock className="text-green-600 text-2xl mb-4" />
                                                    <input
                                                        type="time"
                                                        value={formData.openingTime}
                                                        onChange={(e) => handleInputChange('openingTime', e.target.value)}
                                                        className="w-full p-3 font-medium cursor-pointer bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 outline-none text-lg"
                                                    />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="block text-slate-700 font-semibold">Closing Time</label>
                                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                                                        <FaClock className="text-orange-600 text-2xl mb-4" />
                                                        <input
                                                            type="time"
                                                            value={formData.closingTime}
                                                            onChange={(e) => handleInputChange('closingTime', e.target.value)}
                                                            className="w-full p-3 font-medium cursor-pointer bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 outline-none text-lg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                                <h4 className="font-semibold text-blue-800 mb-4">⏰ Business Hours Summary</h4>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-slate-800">
                                                            {formData.openingTime || '--:--'} - {formData.closingTime || '--:--'}
                                                        </div>
                                                        <p className="text-slate-600 text-sm mt-1">Daily Operating Hours</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-orange-600 text-sm">
                                                    You're about to complete your restaurant registration. 
                                                    Our team will review your application within 24-48 hours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 6 && (
                                    <div className="space-y-8">
                                        <div className="border-b border-slate-200 pb-6">
                                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Bank Details</h2>
                                            <p className="text-slate-600">Add your bank account information for payments</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <CiBank className="text-xl" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Bank Name *"
                                                        value={formData.bankDetails.bankName}
                                                        onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
                                                        className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                    />
                                                </div>

                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <FaUser className="text-sm" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Account Holder Name *"
                                                        value={formData.bankDetails.accountHolderName}
                                                        onChange={(e) => handleInputChange('bankDetails.accountHolderName', e.target.value)}
                                                        className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <FaRegCreditCard className="text-sm" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Account Number *"
                                                        value={formData.bankDetails.accountNumber}
                                                        onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
                                                        className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                    />
                                                </div>

                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <FaBuilding className="text-sm" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="IFSC Code *"
                                                        value={formData.bankDetails.IFSC}
                                                        onChange={(e) => handleInputChange('bankDetails.IFSC', e.target.value.toUpperCase())}
                                                        className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                    <FaMobile className="text-sm" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="UPI ID (Optional)"
                                                    value={formData.bankDetails.upi_id}
                                                    onChange={(e) => handleInputChange('bankDetails.upi_id', e.target.value)}
                                                    className="w-full p-4 pl-12 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                                <h4 className="font-semibold text-blue-800 mb-2">💳 Bank Account Guidelines</h4>
                                                <ul className="text-blue-700 text-sm space-y-2">
                                                    <li>• Enter details exactly as they appear in your bank account</li>
                                                    <li>• Double-check IFSC code and account number</li>
                                                    <li>• UPI ID is optional but recommended for faster payments</li>
                                                    <li>• All payment information is encrypted and secure</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="sticky bottom-0 select-none bg-white border-t border-slate-200 flex justify-between items-center mt-6 lg:mt-10 pt-4 lg:pt-8 px-2">
                                {currentStep === 1 && (
                                    <Link to={"/restaurant/login"}
                                        className="flex cursor-pointer items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <span>Login here</span>
                                    </Link>
                                )}

                                {currentStep > 1 ? (
                                    <button
                                        onClick={prevStep}
                                        className="flex cursor-pointer items-center space-x-2 px-8 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all duration-300 hover:shadow-md"
                                    >
                                        <span>Previous</span>
                                    </button>
                                ) : <div />}
                                
                                {currentStep < steps.length ? (
                                    <button
                                        onClick={nextStep}
                                        className="flex cursor-pointer items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <span>Continue</span>
                                        <FaArrowRight />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex cursor-pointer items-center space-x-2 lg:px-8 px-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <FaCheckCircle />
                                        <span>{registerRestaurantMutation.isPending ? "Registering. . ." : "Submit Application"}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Part (Hidden on mobile) */}
                <div className="hidden lg:block lg:w-fit">
                    <div className="sticky top-20">
                        {/* Website Name */}
                        <h1 className="text-6xl font-extrabold text-orange-500 mb-2 drop-shadow-md tracking-tight md:tracking-wide">
                            FlavorForge
                        </h1>

                        {/* Tagline */}
                        <p className="text-lg text-slate-600 font-medium">
                            Where your passion for food meets our network.
                        </p>

                        {/* Subtly animated decorative line */}
                        <div className="w-16 h-1 bg-orange-300 mx-auto mt-4 rounded-full animate-pulse-slow"></div>

                        <div className="mt-10 w-full">
                            <img
                                className="w-full h-[60vh] object-cover rounded-2xl shadow-2xl shadow-black"
                                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2hlZnxlbnwwfHwwfHx8MA%3D%3D" alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantSignupPage;