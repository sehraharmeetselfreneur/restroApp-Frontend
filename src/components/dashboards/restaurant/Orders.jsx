import { Clock, MapPin, Package, ShoppingBag } from "lucide-react";
import { X, User, Phone, ChefHat, Truck, CheckCircle, DollarSign, Calendar, Hash } from 'lucide-react';
import useAuthStore from "../../../store/useAuthStore";
import VerificationBanner from "./VerificationBanner";
import { useState } from "react";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const getStatusConfig = (status) => {
        const configs = {
            'pending': {
                label: 'Pending',
                color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                icon: Clock,
                gradient: 'from-yellow-400 to-orange-400'
            },
            'accepted': {
                label: 'Accepted',
                color: 'bg-blue-100 text-blue-700 border-blue-200',
                icon: CheckCircle,
                gradient: 'from-blue-400 to-cyan-400'
            },
            'preparing': {
                label: 'Preparing',
                color: 'bg-orange-100 text-orange-700 border-orange-200',
                icon: ChefHat,
                gradient: 'from-orange-400 to-red-400'
            },
            'outForDelivery': {
                label: 'Out for Delivery',
                color: 'bg-green-100 text-green-700 border-green-200',
                icon: Truck,
                gradient: 'from-green-400 to-emerald-400'
            },
            'delivered': {
                label: 'Delivered',
                color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                icon: CheckCircle,
                gradient: 'from-emerald-400 to-teal-400'
            }
        };
        return configs[status] || configs['pending'];
    };

    const statusConfig = getStatusConfig(order.orderStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 no-scrollbar bg-black/5 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white no-scrollbar rounded-3xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${statusConfig.gradient} text-white shadow-lg`}>
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                                <p className="text-gray-600">#{order._id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status and Order Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Status Card */}
                        <div className={`border-2 ${statusConfig.color} rounded-2xl p-4`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${statusConfig.gradient} text-white`}>
                                    <StatusIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Order Status</p>
                                    <p className="text-lg font-bold text-gray-800">{statusConfig.label}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Amount Card */}
                        <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 text-white">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Amount</p>
                                    <p className="text-lg font-bold text-gray-800">₹{order.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500 rounded-xl">
                                <User size={20} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Customer Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                                <User size={18} className="text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Name</p>
                                    <p className="text-gray-800 font-semibold">{order.customer_id.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                                <Phone size={18} className="text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                                    <p className="text-gray-800 font-semibold">{order.customer_id.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-xl p-4 md:col-span-2">
                                <MapPin size={18} className="text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Delivery Address</p>
                                    <p className="text-gray-800 font-semibold">Near {order.deliveryAddress.landmark}<br/> {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}-{order.deliveryAddress.pincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500 rounded-xl">
                                <Package size={20} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Order Items ({order.items.length})</h3>
                        </div>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {item.quantity}x
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 text-lg">{item.foodItem.name}</p>
                                            <p className="text-sm font-semibold text-purple-600">₹{item.price} each</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 font-medium">Subtotal</p>
                                        <p className="text-xl font-bold text-gray-800">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Order Summary */}
                        <div className="mt-6 bg-white rounded-xl p-4 border-2 border-purple-200">
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold">₹{order.deliveryFee || 0}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span className="font-semibold">₹{order.tax || 0}</span>
                                </div>
                                <div className="border-t-2 border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                        <span className="text-2xl font-bold text-purple-600">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                      
                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center gap-3">
                                <Clock size={18} className="text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Prep Time</p>
                                    <p className="font-bold text-gray-800">{order.prepTime || '30 mins'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Distance</p>
                                    <p className="font-bold text-gray-800">{order.distance || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Order Date</p>
                                    <p className="font-bold text-gray-800">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                      
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        {order.orderStatus === 'pending' && (
                            <>
                                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                    <CheckCircle size={20} />
                                    Accept Order
                                </button>
                                <button className="flex-1 px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                    <X size={20} />
                                    Decline Order
                                </button>
                            </>
                        )}
                        {order.orderStatus === 'accepted' && (
                            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                <ChefHat size={20} />
                                Mark as Preparing
                            </button>
                        )}
                        {order.orderStatus === 'preparing' && (
                            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                <Truck size={20} />
                                Mark as Out for Delivery
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Orders = ({ setActiveTab }) => {
    const { user } = useAuthStore();
    const orders = user.orders;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All Orders");

    const filteredOrders = orders.filter(order => {
        if (filterStatus === "All Orders") return true;
        return order.orderStatus === filterStatus;
    });

    const orderStatusLabels = {
        pending: "Pending",
        accepted: "Accepted",
        preparing: "Preparing",
        outForDelivery: "Out for Delivery",
        delivered: "Delivered",
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {user.profile.isVerified ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Package size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                                <p className="text-gray-600">Track and manage all your restaurant orders</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option>All Orders</option>
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="preparing">Preparing</option>
                              <option value="outForDelivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                                Export Orders
                            </button>
                        </div>
                    </div>
                
                    <div className="space-y-4">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div key={order._id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm">
                                                <ShoppingBag size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="text-lg font-bold text-gray-800">Order #{order._id}</p>
                                                    <span
                                                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                            order.orderStatus === 'preparing' ? 'bg-orange-100 text-orange-700' :
                                                            order.orderStatus === 'outForDelivery' ? 'bg-green-100 text-green-700' :
                                                            order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.orderStatus === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}
                                                    >
                                                        {orderStatusLabels[order.orderStatus] || order.orderStatus}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 font-medium">{order.customer_id.customerName}</p>
                                                <p className="text-sm text-gray-500">{order.items.length} items • ₹{order.totalAmount} • </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>{user.profile.avgPrepTime || "30Mins"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span>{(order.distance/1000).toFixed(2)} Km</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                            
                                    <OrderDetailsModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        order={selectedOrder}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-200 rounded-2xl">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                                <p className="text-gray-500 text-center px-4">
                                    You don’t have any orders at the moment. Once customers start placing orders, they will appear here for you to manage.
                                </p>
                                <button
                                    className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                                    onClick={() => setActiveTab('menu')}
                                >
                                    Explore Menu
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <VerificationBanner />
            )}
        </div>
    );
};
export default Orders;