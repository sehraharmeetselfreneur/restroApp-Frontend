import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  Home,
  Building,
  Navigation,
  ChevronRight,
  AlertCircle,
  Wallet,
  Calendar,
  User,
  Phone,
  Mail,
  Edit,
  Plus,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { 
  Smartphone,
  Truck,
  Lock,
  Shield,
  Copy,
  Download,
  QrCode,
  Info,
  X
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress, getCustomerProfile } from '../api/customerApi';
import Navbar from '../components/home/Navbar'
import { createOrder } from '../api/orderApi';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes for UPI
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [orderData, setOrderData] = useState({
    customer_id: user?.profile?._id,
    restaurant_id: user?.cart?.items[0]?.foodItemId?.restaurant_id,
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      coordinates: []
    },
    paymentMethod: paymentMethod,
    special_instructions: '',
    deliveryFee: 0,
    discountApplied: 0
  });
  const [newAddress, setNewAddress] = useState({
    newAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      tag: ''
    }
  });
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: async (data) => {
        toast.success(data.message);
        setUseExistingAddress(true);
        setUser(await getCustomerProfile(), "Customer");
        setNewAddress({
            newAddress: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                landmark: ''
            }
        });
        queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
    onError: (error) => {
        toast.error(error.response.data?.message || "Something went wrong");
    }
  });
  
  const placeOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
        setPaymentSuccess(true);
        setUser(await getCustomerProfile(), "Customer");
        queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
        toast.success("Order placed successfully");
    },
    onError: (error) => {
        toast.error(error.response.data?.message || "Something went wrong");
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const calculateSubtotal = () => {
    return user?.cart?.items.reduce((total, item) => {
      const price = item.foodItemId.discount_price || item.foodItemId.price;
      return total + (price * item.quantity);
    }, 0) || 0;
  };

  const deliveryFee = calculateSubtotal() > 500 ? 0 : 50;
  const taxes = calculateSubtotal() * 0.05;
  const finalAmount = calculateSubtotal() + deliveryFee + taxes;

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setOrderData(prev => ({
        ...prev,
        deliveryAddress: {
            street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark || '',
        coordinates: [address.geoLocation?.lng || 0, address.geoLocation?.lat || 0]
    }
    }));
  };

  const handleAddAddress = () => {
    addAddressMutation.mutate(newAddress.newAddress);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewAddress(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const steps = [
    { number: 1, title: 'Delivery Address', icon: MapPin },
    { number: 2, title: 'Order Review', icon: ShoppingBag },
    { number: 3, title: 'Payment', icon: CreditCard }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let interval;
    if (showQR && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showQR, timer]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      if (formattedValue.replace('/', '').length > 4) return;
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/gi, '').slice(0, 4);
    }

    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!orderData.deliveryAddress.street || !orderData.paymentMethod) {
      toast.error('Please fill all required fields');
      return;
    }
    placeOrderMutation.mutate(orderData);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('merchant@upi');
    alert('UPI ID copied to clipboard!');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      desc: 'Visa, Mastercard, Amex accepted',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      desc: 'PhonePe, Google Pay, Paytm',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      desc: 'FlavorForge Wallet Balance',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Truck,
      desc: 'Pay when you receive',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </button>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="w-20"></div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-white text-orange-500'
                      : 'bg-white/20 text-white'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-white' : 'text-white/70'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                    currentStep > step.number ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Delivery Address */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-orange-500" />
                    Delivery Address
                  </h2>

                  {/* Toggle between saved and new address */}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setUseExistingAddress(true)}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        useExistingAddress
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } cursor-pointer`}
                    >
                      Saved Addresses
                    </button>
                    <button
                      onClick={() => setUseExistingAddress(false)}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        !useExistingAddress
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } cursor-pointer`}
                    >
                      Add New Address
                    </button>
                  </div>

                  {useExistingAddress ? (
                    <div className="space-y-4">
                      {user.profile?.address.map((address) => (
                        <div
                          key={address.tag}
                          onClick={() => handleAddressSelect(address)}
                          className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddress?.tag === address.tag
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                address.tag === 'Home' ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                {address.tag === 'Home' ? (
                                  <Home className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Building className="h-5 w-5 text-green-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 mb-1">{address.tag}</h3>
                                <p className="text-gray-600 text-sm">{address.street}</p>
                                <p className="text-gray-600 text-sm">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                                {address.landmark && (
                                  <p className="text-gray-500 text-xs mt-1">Landmark: {address.landmark}</p>
                                )}
                              </div>
                            </div>
                            {selectedAddress?.tag === address.tag && (
                              <CheckCircle className="h-6 w-6 text-orange-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Street Address*
                        </label>
                        <input
                          type="text"
                          name="newAddress.street"
                          value={newAddress.newAddress.street}
                          onChange={handleAddressInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="House/Flat No., Building Name, Area"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City*
                          </label>
                          <input
                            type="text"
                            name="newAddress.city"
                            value={newAddress.newAddress.city}
                            onChange={handleAddressInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            State*
                          </label>
                          <input
                            type="text"
                            name="newAddress.state"
                            value={newAddress.newAddress.state}
                            onChange={handleAddressInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="State"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pincode*
                          </label>
                          <input
                            type="text"
                            name="newAddress.pincode"
                            value={newAddress.newAddress.pincode}
                            onChange={handleAddressInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Pincode"
                            maxLength="6"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            name="newAddress.landmark"
                            value={newAddress.newAddress.landmark}
                            onChange={handleAddressInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Landmark"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tag
                          </label>
                          <input
                            type="text"
                            name="newAddress.tag"
                            value={newAddress.newAddress.tag}
                            onChange={handleAddressInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Landmark"
                          />
                        </div>
                      </div>
                      <button onClick={handleAddAddress} className={`w-fit px-4 py-3 ${addAddressMutation.isPending ? "disabled" : ""} bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 text-white rounded-xl font-bold text-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                        <span>{addAddressMutation.isPending ? "Adding..." : "Add Address"}</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (useExistingAddress && !selectedAddress) {
                      toast.error('Please select an address');
                      return;
                    }
                    if (!useExistingAddress && !orderData.deliveryAddress.street) {
                      toast.error('Please fill address details');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  className="w-full bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Step 2: Order Review */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <ShoppingBag className="h-6 w-6 mr-3 text-orange-500" />
                    Review Your Order
                  </h2>

                  <div className="space-y-4">
                    {user?.cart?.items.map((item, index) => {
                      const foodItem = item.foodItemId;
                      const price = foodItem.discount_price || foodItem.price;
                      return (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${foodItem.images[0]}`}
                            alt={foodItem.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{foodItem.name}</h3>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-orange-600 font-bold mt-1">₹{price * item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="special_instructions"
                      value={orderData.special_instructions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      placeholder="Any special requests for your order..."
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 cursor-pointer bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Payment Methods */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Select Payment Method */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Payment Method</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            onClick={() => {
                              setPaymentMethod(method.id);
                              setOrderData(prev => ({ ...prev, paymentMethod: method.id }));
                              setShowQR(false);
                            }}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              paymentMethod === method.id
                                ? 'border-orange-500 bg-orange-50 shadow-lg'
                                : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center`}>
                                <method.icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-800">{method.name}</h3>
                                <p className="text-sm text-gray-600">{method.desc}</p>
                              </div>
                              {paymentMethod === method.id && (
                                <CheckCircle className="h-6 w-6 text-orange-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Details */}
                    {paymentMethod && (
                      <form onSubmit={handlePayment} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        {paymentMethod === 'card' && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Enter Card Details</h3>
                            
                            {/* Card Preview */}
                            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                              <div className="relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                  <div className="w-12 h-12 bg-yellow-400 rounded-lg"></div>
                                  <div className="text-right">
                                    <p className="text-xs opacity-75">CREDIT CARD</p>
                                  </div>
                                </div>
                                <div className="mb-6">
                                  <p className="text-2xl tracking-wider font-mono">
                                    {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                                  </p>
                                </div>
                                <div className="flex justify-between items-end">
                                  <div>
                                    <p className="text-xs opacity-75 mb-1">CARD HOLDER</p>
                                    <p className="font-semibold">{cardDetails.cardName || 'YOUR NAME'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs opacity-75 mb-1">EXPIRES</p>
                                    <p className="font-semibold">{cardDetails.expiryDate || 'MM/YY'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number*</label>
                                <input
                                  type="text"
                                  name="cardNumber"
                                  value={cardDetails.cardNumber}
                                  onChange={handleCardInputChange}
                                  placeholder="1234 5678 9012 3456"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name*</label>
                                <input
                                  type="text"
                                  name="cardName"
                                  value={cardDetails.cardName}
                                  onChange={handleCardInputChange}
                                  placeholder="John Doe"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date*</label>
                                  <input
                                    type="text"
                                    name="expiryDate"
                                    value={cardDetails.expiryDate}
                                    onChange={handleCardInputChange}
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV*</label>
                                  <input
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleCardInputChange}
                                    placeholder="123"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  />
                                </div>
                              </div>

                              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-blue-800">Secure Payment</p>
                                  <p className="text-xs text-blue-600">Your card details are encrypted and secure</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'upi' && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">UPI Payment</h3>
                            
                            <div className="flex gap-4">
                              <button
                                onClick={() => setShowQR(false)}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                                  !showQR ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                Enter UPI ID
                              </button>
                              <button
                                onClick={() => setShowQR(true)}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                                  showQR ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                Scan QR Code
                              </button>
                            </div>

                            {!showQR ? (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter UPI ID*</label>
                                  <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@paytm"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  />
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                  <p className="text-sm text-purple-800 mb-2">Supported UPI Apps:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {['PhonePe', 'Google Pay', 'Paytm', 'BHIM'].map(app => (
                                      <span key={app} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                                        {app}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center">
                                  <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
                                    <QrCode className="h-48 w-48 text-gray-800" />
                                  </div>
                                  <p className="text-sm font-semibold text-gray-800 mb-2">Scan QR Code to Pay</p>
                                  <div className="flex items-center space-x-2 text-orange-600 font-bold text-xl">
                                    <Clock className="h-5 w-5" />
                                    <span>{formatTimer(timer)}</span>
                                  </div>
                                </div>

                                <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">UPI ID</p>
                                      <p className="font-mono font-semibold text-gray-800">merchant@upi</p>
                                    </div>
                                    <button
                                      onClick={copyUpiId}
                                      className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                      <Copy className="h-4 w-4" />
                                      <span>Copy</span>
                                    </button>
                                  </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                  <p className="text-sm text-blue-800">
                                    <Info className="h-4 w-4 inline mr-2" />
                                    Scan the QR code with any UPI app or copy the UPI ID to complete payment
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {paymentMethod === 'wallet' && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">FlavorForge Wallet</h3>
                            
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
                              <div className="flex items-center justify-between mb-6">
                                <div>
                                  <p className="text-white/80 mb-2">Available Balance</p>
                                  <p className="text-4xl font-bold">₹2,450</p>
                                </div>
                                <Wallet className="h-12 w-12 text-white/50" />
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-white/80">Reward Points: 1,250</p>
                                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                  Add Money
                                </button>
                              </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-green-800">Sufficient Balance Available</p>
                                <p className="text-xs text-green-600">You can complete this payment using your wallet</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Order Amount</span>
                                <span className="font-semibold">₹{finalAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Wallet Balance After Payment</span>
                                <span className="font-semibold text-orange-600">₹{2450 - finalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'cod' && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Cash on Delivery</h3>
                            
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                              <Truck className="h-16 w-16 text-green-600 mx-auto mb-4" />
                              <h4 className="text-xl font-bold text-gray-800 mb-2">Pay when you receive</h4>
                              <p className="text-gray-600">
                                You can pay cash to the delivery partner when your order arrives
                              </p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                              <p className="text-sm text-yellow-800">
                                <AlertCircle className="h-4 w-4 inline mr-2" />
                                Please keep exact change of ₹{finalAmount.toFixed(2)} ready
                              </p>
                            </div>

                            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                              <h5 className="font-semibold text-gray-800">Things to Remember:</h5>
                              <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                                  <span>Payment accepted in cash only</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                                  <span>Delivery partner cannot provide change for large bills</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                                  <span>No additional charges for COD</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Pay Button */}
                        <button
                          type='submit'
                          disabled={placeOrderMutation.isPending || (paymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv))}
                          hidden={!paymentMethod}
                          className="w-full mt-5 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                          {placeOrderMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-5 w-5" />
                              <span>Pay ₹{finalAmount.toFixed(2)}</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-semibold">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Taxes (5%)</span>
                  <span className="font-semibold">₹{taxes.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-orange-600">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Safe & Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal - Show when paymentSuccess is true */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your order has been confirmed and will be delivered soon.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-bold text-green-600">₹{finalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-bold text-gray-800 capitalize">{paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-bold text-green-600">Confirmed</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/orders')}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Track Order
              </button>
              <button 
                onClick={() => setPaymentSuccess(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;