import { useState, useRef, useCallback } from "react";
import { FaUtensils, FaFileUpload, FaClock, FaUniversity, FaFileAlt, FaCheckCircle, FaArrowRight, FaTimes, FaCamera, FaPlus } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdRestaurant, MdImage, MdAccessTime, MdAccountBalance, MdDescription } from "react-icons/md";

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
];

const VerticalStepNavigation = ({ currentStep, steps, onStepClick }) => (
    <div className="w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl sticky top-8 h-fit">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Partner Registration</h2>
            <p className="text-slate-400 text-sm">Complete all steps to join our platform</p>
        </div>
        
        <div className="space-y-1">
            {steps.map((step, index) => (
                <div key={step.id}>
                    <div
                        onClick={() => onStepClick && onStepClick(step.id)}
                        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            currentStep === step.id
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30"
                                : currentStep > step.id
                                ? "bg-green-500/20 hover:bg-green-500/30"
                                : "hover:bg-slate-700/50"
                        }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                currentStep === step.id
                                    ? "bg-white text-orange-600 shadow-md"
                                    : currentStep > step.id
                                    ? "bg-green-500 text-white"
                                    : "bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300"
                            }`}>
                                {currentStep > step.id ? (
                                    <FaCheckCircle className="w-5 h-5" />
                                ) : (
                                    <div className="text-lg">{step.icon}</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                                    currentStep === step.id
                                        ? "text-white"
                                        : currentStep > step.id
                                        ? "text-green-200"
                                        : "text-slate-300 group-hover:text-white"
                                }`}>
                                    {step.label}
                                </h3>
                                <p className={`text-xs mt-1 transition-colors duration-300 ${
                                    currentStep === step.id
                                        ? "text-orange-100"
                                        : currentStep > step.id
                                        ? "text-green-300"
                                        : "text-slate-500 group-hover:text-slate-400"
                                }`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                        <div className={`ml-9 h-6 w-0.5 transition-colors duration-500 ${
                            currentStep > step.id ? "bg-green-500" : "bg-slate-700"
                        }`} />
                    )}
                </div>
            ))}
        </div>

        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-slate-300 text-sm font-medium">Progress</span>
            </div>
            <div className="bg-slate-700 rounded-full h-2 mb-2">
                <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
            </div>
            <p className="text-slate-400 text-xs">
                Step {currentStep} of {steps.length} completed
            </p>
        </div>
    </div>
);

const RestaurantSignupPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        restaurantName: '',
        description: '',
        cuisines: [],
        phone: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            geoLocation: { lat: null, lng: null }
        },
        licenseNumber: {
            fssai: '',
            gst: ''
        },
        openingTime: '',
        closingTime: '',
        images: []
    });

    const [cuisineInput, setCuisineInput] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);
    const [documents, setDocuments] = useState({
        fssaiLicense: null,
        gstCertificate: null,
        panCard: null
    });
    const fileInputRef = useRef(null);
    const documentInputRefs = useRef({
        fssai: null,
        gst: null,
        pan: null
    });

    const nextStep = () => {
        if (currentStep < steps.length) setCurrentStep(currentStep + 1);
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
                alert('Please upload only PDF, JPEG, or PNG files.');
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert('File size should be less than 5MB.');
                return;
            }

            // Convert to base64 for storage
            const reader = new FileReader();
            reader.onload = (e) => {
                setDocuments(prev => ({
                    ...prev,
                    [documentType]: {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: e.target.result
                    }
                }));

                // Also update the main formData if needed
                setFormData(prev => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        [documentType]: e.target.result
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeDocument = (documentType) => {
        setDocuments(prev => ({
            ...prev,
            [documentType]: null
        }));

        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [documentType]: null
            }
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

    const handleInputChange = useCallback((field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent] || {}),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
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
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, e.target.result]
                }));
            };
            reader.readAsDataURL(file);
        });
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

                // Try to get address from coordinates using reverse geocoding
                try {
                    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.VITE_GEOCODE_API_KEY}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.results && data.results[0]) {
                            const addressComponents = data.results[0].components;
                            const formattedAddress = data.results[0].formatted;
                            
                            // Update address fields if they're empty
                            setFormData(prev => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    street: prev.address.street || `${addressComponents.house_number || ''} ${addressComponents.road || ''}`.trim(),
                                    city: prev.address.city || addressComponents.city || addressComponents.town || addressComponents.village || '',
                                    state: prev.address.state || addressComponents.state || '',
                                    pincode: prev.address.pincode || addressComponents.postcode || '',
                                    geoLocation: {
                                        lat: latitude,
                                        lng: longitude
                                    }
                                }
                            }));
                        }
                    }
                } catch (error) {
                    console.log('Reverse geocoding failed, but location coordinates saved:', error);
                }
                
                setLocationLoading(false);
                alert(`Location captured successfully!\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}`);
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
        console.log("Form Data: ", formData);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-300 via-white to-slate-800 p-8">
            <div className="max-w-full flex">
                {/* Header */}
                <div className="text-center flex mb-12">
                    {/* <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                        Join Our Restaurant Network
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Partner with us to reach thousands of customers and grow your business
                    </p> */}
                </div>

                {/* Main Content */}
                <div className="flex gap-8 mt-5">
                    {/* Left Sidebar - Vertical Steps (Sticky) */}
                    <VerticalStepNavigation 
                        currentStep={currentStep} 
                        steps={steps} 
                        onStepClick={handleStepClick}
                    />

                    {/* Right Content - Scrollable Form */}
                    <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-[95vh] overflow-y-auto">
                        <div className="p-8 flex flex-col">
                            <div className="min-h-[63vh] min-w-3xl">
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
                                                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
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
                                                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 resize-none group-focus-within:shadow-md"
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
                                                            className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={addCuisine}
                                                        className="px-6 py-3 cursor-pointer bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center gap-2"
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
                                                        className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                        <MdPhone />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        placeholder="Contact Number *"
                                                        value={formData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                    />
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
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                                    <MdLocationOn />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Street Address *"
                                                    value={formData.address.street}
                                                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                                                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300 group-focus-within:shadow-md"
                                                />
                                            </div>

                                            {/* City, State, PIN */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <input
                                                    type="text"
                                                    placeholder="City *"
                                                    value={formData.address.city}
                                                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="State *"
                                                    value={formData.address.state}
                                                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="PIN Code *"
                                                    value={formData.address.pincode}
                                                    onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
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
                                                    className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 flex items-center gap-2 ${
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
                                                        {formData.images.map((image, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={image}
                                                                    alt={`Restaurant ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-xl shadow-md"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                                                                >
                                                                    <FaTimes className="text-xs" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                                <h4 className="font-semibold text-green-800 mb-2">📸 Photo Tips</h4>
                                                <ul className="text-green-700 text-sm space-y-1">
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
                                    <div className="space-y-8">
                                        <div className="border-b border-slate-200 pb-6">
                                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Legal Documentation</h2>
                                            <p className="text-slate-600">Upload required licenses and certificates</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* License Numbers */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <input
                                                    type="text"
                                                    placeholder="FSSAI License Number *"
                                                    value={formData.licenseNumber.fssai}
                                                    onChange={(e) => handleInputChange('licenseNumber.fssai', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="GST Number"
                                                    value={formData.licenseNumber.gst}
                                                    onChange={(e) => handleInputChange('licenseNumber.gst', e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none hover:border-slate-300"
                                                />
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                                                <h4 className="font-semibold text-yellow-800 mb-2">📋 Required Documents</h4>
                                                <div className="space-y-3">
                                                    {[
                                                        { name: "FSSAI License", key: "fssaiLicense", inputRef: "fssai", required: true, desc: "Food Safety certification" },
                                                        { name: "GST Certificate", key: "gstCertificate", inputRef: "gst", required: false, desc: "Tax registration document" },
                                                        { name: "PAN Card", key: "panCard", inputRef: "pan", required: false, desc: "Business PAN verification" }
                                                    ].map((doc, index) => (
                                                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div>
                                                                    <span className="font-medium text-slate-700">{doc.name}</span>
                                                                    {doc.required && (
                                                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Required</span>
                                                                    )}
                                                                    <p className="text-xs text-slate-500">{doc.desc}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
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
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex-shrink-0">
                                                                            {documents[doc.key].type === 'application/pdf' ? (
                                                                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                                                    <span className="text-red-600 font-bold text-xs">PDF</span>
                                                                                </div>
                                                                            ) : (
                                                                                <img
                                                                                    src={documents[doc.key].data}
                                                                                    alt="Document preview"
                                                                                    className="w-10 h-10 object-cover rounded-lg"
                                                                                />
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
                                                    <ul className="text-blue-700 text-xs space-y-1">
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
                                                        className="w-full p-3 cursor-pointer bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 outline-none text-lg"
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
                                                            className="w-full p-3 cursor-pointer bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 outline-none text-lg"
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
                            </div>

                            {/* Navigation Buttons */}
                            <div className="sticky bottom-0 bg-white border-t border-slate-200 flex justify-between items-center mt-12 pt-8">
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
                                        className="flex cursor-pointer items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <FaCheckCircle />
                                        <span>Submit Application</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantSignupPage;