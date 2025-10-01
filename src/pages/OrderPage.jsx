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
  ArrowRight
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress, getCustomerProfile } from '../api/customerApi';

const OrderPage = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    customer_id: user?.profile?._id,
    restaurant_id: user?.cart?.items[0]?.foodItemId?.restaurant_id,
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    paymentMethod: '',
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
  const [selectedAddress, setSelectedAddress] = useState(null);
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
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const paymentMethods = [
    { id: 'COD', name: 'Cash on Delivery', icon: Wallet, desc: 'Pay when you receive' },
    { id: 'Card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Secure online payment' },
    { id: 'UPI', name: 'UPI Payment', icon: Phone, desc: 'PhonePe, Google Pay, Paytm' },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet, desc: 'FlavorForge Wallet' }
  ];

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
        landmark: address.landmark || ''
      }
    }));
  };

  const handleAddAddress = () => {
    console.log(newAddress.newAddress);
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

  const handlePlaceOrder = async () => {
    // Validate all required fields
    if (!orderData.deliveryAddress.street || !orderData.paymentMethod) {
      toast.error('Please fill all required fields');
      return;
    }

    // API call to place order
    console.log('Order data:', {
      ...orderData,
      items: user.cart.items,
      totalAmount: calculateSubtotal(),
      deliveryFee,
      finalAmount,
      customer_id: user.profile?._id,
      restaurant_id: user.cart.items[0]?.foodItemId.restaurant_id
    });

    console.log(orderData);

    // Navigate to success page
  };

  const steps = [
    { number: 1, title: 'Delivery Address', icon: MapPin },
    { number: 2, title: 'Order Review', icon: ShoppingBag },
    { number: 3, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-orange-500" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setOrderData(prev => ({...prev, paymentMethod: method.id}))}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          orderData.paymentMethod === method.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <method.icon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.desc}</p>
                            </div>
                          </div>
                          {orderData.paymentMethod === method.id && (
                            <CheckCircle className="h-6 w-6 text-orange-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 cursor-pointer bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!orderData.paymentMethod}
                    className="flex-1 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Place Order</span>
                  </button>
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
    </div>
  );
};

export default OrderPage;