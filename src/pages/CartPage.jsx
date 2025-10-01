import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  ArrowLeft,
  Tag,
  Clock,
  Leaf,
  Flame,
  Star,
  MapPin,
  CreditCard,
  Percent,
  Gift,
  AlertCircle,
  CheckCircle,
  X,
  ShoppingBag,
  Truck,
  Home,
  ChevronRight
} from 'lucide-react';

import Navbar from '../components/home/Navbar';
import useAuthStore from '../store/useAuthStore';
import { addToCartApi, removeFromCartApi, removeItemFromCartApi } from '../api/cartApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getCustomerProfile } from '../api/customerApi';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { user, setUser } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState('Home');

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const addToCartMutation = useMutation({
        mutationFn: addToCartApi,
        onSuccess: async (data) => {
            setUser(await getCustomerProfile(), "Customer");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });
    const removeFromCartMutation = useMutation({
        mutationFn: removeFromCartApi,
        onSuccess: async (data) => {
            setUser(await getCustomerProfile(), "Customer");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });
    const removeItemFromCartMutation = useMutation({
        mutationFn: removeItemFromCartApi,
        onSuccess: async (data) => {
            toast.success(data.message);
            setUser(await getCustomerProfile(), "Customer");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    })

    const updateQuantity = (itemId, variantId = null) => {
        if(user){
            const payload = {
                itemId,
                variantId,
                quantity: 1
            }
            console.log(payload);
            addToCartMutation.mutate(payload);
        }
        else{
            navigate("/customer/login");
        }
    };

    const removeItem = (itemId, variantId = null) => {
        removeFromCartMutation.mutate(itemId, variantId);
    };

    const removeFoodItem = (itemId, variantId = '') => {
        removeItemFromCartMutation.mutate({itemId: itemId, variantId: variantId});
    }

    const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setAppliedPromo({
        code: 'SAVE20',
        discount: 20,
        type: 'percentage'
      });
    }
    };

    const calculateSubtotal = () => {
    return user.cart?.items.reduce((total, item) => {
      const price = item.foodItemId.discount_price || item.foodItemId.price;
      return total + (price * item.quantity);
    }, 0) || 0;
    };

    const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateSubtotal();
    if (appliedPromo.type === 'percentage') {
      return (subtotal * appliedPromo.discount) / 100;
    }
    return appliedPromo.discount;
    };

    const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const taxes = (subtotal - discount) * 0.05; // 5% tax
    return subtotal - discount + deliveryFee + taxes;
    };

    if (!user.cart) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (user.cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <Navbar />
                <div className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center flex flex-col justify-center items-center">
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingCart className="h-16 w-16 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven't added anything to your cart yet. Start exploring our menu!
                        </p>
                        <button onClick={() => navigate("/restaurants")} className="bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2">
                            <span>Browse Restaurants</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
      );
    }

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Navbar */}
        <Navbar />

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-2">
            <div className="max-w-7xl flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3 mb-2">
                    <ShoppingCart className="h-8 w-8" />
                    <h1 className="text-4xl font-bold">Your Cart</h1>
                </div>
                <p className="text-white/90 text-lg">
                    {user.cart.items.length} {user.cart.items.length === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-5">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Address Selection */}
                    {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                            Delivery Address
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {user.profile.address.map((addr) => (
                                <button
                                    key={addr?.tag}
                                    onClick={() => setDeliveryAddress(addr?.tag)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-left ${
                                    deliveryAddress === addr?.tag
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-orange-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3 mb-2">
                                        {addr.tag === "Home" ? <Home className={`h-5 w-5 ${deliveryAddress === addr?.tag ? 'text-orange-500' : 'text-gray-500'}`} /> : <MapPin className={`h-5 w-5 ${deliveryAddress === addr?.tag ? 'text-orange-500' : 'text-gray-500'}`} />}
                                        <span className={`font-semibold ${deliveryAddress === addr?.tag ? 'text-orange-600' : 'text-gray-800'}`}>
                                            {addr?.tag}
                                        </span>
                                        {deliveryAddress === addr?.tag && (
                                            <CheckCircle className="h-5 w-5 text-orange-500 ml-auto" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">{addr?.street},<br />{addr?.city}, {addr?.pincode}</p>
                                </button>
                            ))}
                        </div>
                    </div> */}
                      
                    {/* Cart Items List */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <ShoppingBag className="h-5 w-5 mr-2 text-orange-500" />
                                Order Items
                            </h3>
                        </div>
                            
                        <div className="divide-y divide-gray-200">
                            {user?.cart?.items?.map(item => {
                                const foodItem = item.foodItemId;
                                const price = foodItem.discount_price || foodItem.price;
                                const itemTotal = price * item.quantity;
                                return (
                                    <div key={foodItem._id} className="p-6 hover:bg-gray-50 transition-all duration-300">
                                        <div className="flex gap-6">
                                            {/* Image */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                                                    {foodItem.images && foodItem.images.length > 0 ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKEND_URL}${foodItem.images[0]}`}
                                                            alt={foodItem.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                      <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                                                      </div>
                                                    )}
                                                </div>
                                                {/* Veg/Non-veg indicator */}
                                                <div className={`absolute -top-2 -right-2 w-6 h-6 border-2 ${foodItem.isVeg ? 'border-green-500' : 'border-red-500'} bg-white rounded flex items-center justify-center`}>
                                                    <div className={`w-3 h-3 rounded-full ${foodItem.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                </div>
                                            </div>
                                              
                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-gray-800 mb-1">{foodItem.name}</h4>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{foodItem.description}</p>
                                                    
                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {foodItem.tags?.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                                                            {tag === 'Spicy' && <Flame className="h-3 w-3 mr-1 text-orange-500" />}
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                
                                                {/* Prep Time */}
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{foodItem.preparationTime} mins preparation</span>
                                                </div>
                                                
                                                {/* Price and Quantity Controls */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        {foodItem.discount_price && (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xl font-bold text-gray-800">₹{foodItem.discount_price}</span>
                                                                <span className="text-sm text-gray-500 line-through">₹{foodItem.price}</span>
                                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold">
                                                                    {Math.round(((foodItem.price - foodItem.discount_price) / foodItem.price) * 100)}% OFF
                                                                </span>
                                                            </div>
                                                        )}
                                                        {!foodItem.discount_price && (
                                                            <span className="text-xl font-bold text-gray-800">₹{foodItem.price}</span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-3">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                                            <button
                                                                onClick={() => removeItem(item.foodItemId._id)}
                                                                className="w-8 h-8 cursor-pointer flex items-center justify-center bg-white rounded-md hover:bg-orange-500 hover:text-white transition-colors duration-300"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>
                                                            <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.foodItemId._id)}
                                                                className="w-8 h-8 cursor-pointer flex items-center justify-center bg-white rounded-md hover:bg-orange-500 hover:text-white transition-colors duration-300"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        
                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => removeFoodItem(foodItem._id, "")}
                                                            className="w-10 h-10 cursor-pointer flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-300"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                  
                                                {/* Item Total */}
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">Item total:</span>
                                                        <span className="text-lg font-bold text-orange-600">₹{itemTotal}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                    
                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Promo Code */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <Tag className="h-5 w-5 mr-2 text-orange-500" />
                                Apply Promo Code
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    placeholder="Enter code"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button
                                    onClick={applyPromoCode}
                                    className="px-6 py-3 cursor-pointer bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300"
                                >
                                    Apply
                                </button>
                            </div>
                            {appliedPromo && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-semibold text-green-800">
                                            {appliedPromo.code} applied!
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setAppliedPromo(null)}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Bill Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                <CreditCard className="h-5 w-5 mr-2 text-orange-500" />
                                Bill Details
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{calculateSubtotal()}</span>
                                </div>

                                {appliedPromo && (
                                    <div className="flex items-center justify-between text-green-600">
                                        <span>Discount ({appliedPromo.discount}%)</span>
                                        <span className="font-semibold">-₹{calculateDiscount().toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-gray-700">
                                    <span>Delivery Fee</span>
                                    {calculateSubtotal() > 500 ? (
                                        <span className="text-green-600 font-semibold">FREE</span>
                                    ) : (
                                        <span className="font-semibold">₹50</span>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between text-gray-700">
                                    <span>Taxes & Charges (5%)</span>
                                    <span className="font-semibold">₹{((calculateSubtotal() - calculateDiscount()) * 0.05).toFixed(2)}</span>
                                </div>
                                
                                {calculateSubtotal() <= 500 && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                        <p className="text-xs text-blue-800 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Add ₹{(500 - calculateSubtotal()).toFixed(2)} more to get free delivery!
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t-2 border-gray-200">
                                    <div className="flex items-center justify-between text-xl font-bold text-gray-800">
                                        <span>Total Amount</span>
                                        <span className="text-orange-600">₹{calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                          
                        {/* Checkout Button */}
                        <button onClick={() => navigate("/order")} className="w-full bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                            <span>Proceed to Checkout</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                          
                        {/* Safe & Secure */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                            <div className="flex items-center space-x-3 text-green-800">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-semibold">Safe & Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CartPage;