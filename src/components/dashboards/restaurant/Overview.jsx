import { useState } from "react";
import { 
    Activity, 
    DollarSign, 
    Package, 
    ShoppingBag, 
    Star, 
    Target, 
    TrendingUp,
    Clock,
    MapPin,
    Phone,
    User,
    CheckCircle,
    XCircle,
    Eye,
    X,
    ChefHat,
    Truck,
    AlertCircle,
    FileText,
    Calendar
} from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";
import VerificationBanner from "./VerificationBanner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptOrder, getRestaurantProfile, updateOutForDelivery } from "../../../api/restaurantApi";
import toast from "react-hot-toast";

const StatusUpdateModal = ({ isOpen, onClose, onConfirm, order }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fadeIn">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Update Order Status</h3>
            <button
              onClick={onClose}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Truck size={24} className="text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-800">Out for Delivery</p>
                  <p className="text-sm text-gray-600">Order #{order?._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600">
              Are you sure you want to mark this order as <span className="font-semibold">Out for Delivery</span>? 
              The customer will be notified about this status change.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 cursor-pointer border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(order);
                onClose();
              }}
              className="flex-1 px-4 py-3 cursor-pointer bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Truck size={18} />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Overview = ({ setActiveTab }) => {
    const { user, setUser } = useAuthStore();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderType, setOrderType] = useState(''); // 'incoming' or 'accepted'

    const acceptOrderMutation = useMutation({
        mutationFn: acceptOrder,
        onSuccess: async (data) => {
            setShowOrderModal(false);
            setSelectedOrder(null);
            setUser(await getRestaurantProfile(), "Restaurant");
            queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });
    const outForDeliveryMutation = useMutation({
        mutationFn: updateOutForDelivery,
        onSuccess: async() => {
            setUser(await getRestaurantProfile(), "Restaurant");
            queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
            setIsModalOpen(false);
            setSelectedOrder(null);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const todayOrders = user.orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        const orderDay = orderDate.toISOString().split("T")[0];
        const todayDay = today.toISOString().split("T")[0];
        return orderDay === todayDay;
    });
    const todayRevenue = todayOrders.reduce((total, order) => {
        return total + (order.finalAmount || 0);
    }, 0);
    const allOrders = user?.orders || [];
    const totalRevenue = allOrders.reduce((total, order) => total + (order.finalAmount || 0), 0);
    const avgOrderValue = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;
    const itemSales = {};
    allOrders.forEach((order) => {
        order.items?.forEach((item) => {
            const name = item.foodItem?.name || "Unknown Item";
            itemSales[name] = (itemSales[name] || 0) + (item.quantity || 1);
        });
    });
    let topSellingItem = "N/A";
    if (Object.keys(itemSales).length > 0) {
        topSellingItem = Object.keys(itemSales).reduce((a, b) =>
            itemSales[a] > itemSales[b] ? a : b
        );
    }

    const getOrderChangePercent = () => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const todayStr = today.toISOString().split("T")[0];
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        // Filter today's orders
        const todayOrders = user.orders.filter((order) => {
            const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
            return orderDate === todayStr;
        });

        // Filter yesterday's orders
        const yesterdayOrders = user.orders.filter((order) => {
            const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
            return orderDate === yesterdayStr;
        });

        // Calculate percentage change
        const todayCount = todayOrders.length;
        const yesterdayCount = yesterdayOrders.length;

        let orderChangePercent = 0;
        if (yesterdayCount === 0 && todayCount > 0) {
            orderChangePercent = 100; // full increase if no orders yesterday
        } else if (yesterdayCount > 0) {
            orderChangePercent = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
        }

        // Round off
        orderChangePercent = Math.round(orderChangePercent);

        return orderChangePercent;
    }
    const calculateRevenueChangePercent = (orders = user?.orders) => {
        if (!Array.isArray(orders) || orders.length === 0) return 0;

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const formatDate = (date) => date.toISOString().split("T")[0];

        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);

        // Filter orders by day
        const todayOrders = orders.filter(
            (order) => formatDate(new Date(order.createdAt)) === todayStr
        );

        const yesterdayOrders = orders.filter(
            (order) => formatDate(new Date(order.createdAt)) === yesterdayStr
        );

        // Calculate revenue
        const todayRevenue = todayOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
        const yesterdayRevenue = yesterdayOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);

        // Calculate percentage change
        let percentChange = 0;

        if (yesterdayRevenue === 0 && todayRevenue > 0) {
            percentChange = 100; // full increase if no revenue yesterday
        } else if (yesterdayRevenue > 0) {
            percentChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
        }

        return Math.round(percentChange);
    }

    const calculatePeakHours = (orders = user?.orders, mode = "count") => {
        if (!Array.isArray(orders) || orders.length === 0) return "No data";
          
        // Initialize 24-hour slots
        const hourlyStats = Array(24).fill(0);

        orders.forEach((order) => {
            const hour = new Date(order.createdAt).getHours();
            if (mode === "revenue") {
                hourlyStats[hour] += order.totalAmount || 0;
            } else {
                hourlyStats[hour]++;
            }
        });
      
        // Find the 2-hour peak range
        let maxValue = 0;
        let peakStartHour = 0;
      
        for (let i = 0; i < 23; i++) {
            const twoHourValue = hourlyStats[i] + hourlyStats[i + 1];
            if (twoHourValue > maxValue) {
                maxValue = twoHourValue;
                peakStartHour = i;
            }
        }
      
        // Helper to format hour -> "7 AM", "8 PM"
        const formatHour = (hour) => {
            const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
            const suffix = hour >= 12 ? "PM" : "AM";
            return `${adjustedHour} ${suffix}`;
        };
      
        // Format final range (handles wrap-around like 11 PM–1 AM)
        const endHour = (peakStartHour + 2) % 24;
        return `${formatHour(peakStartHour)}-${formatHour(endHour)}`;
    }

    // Separate incoming and accepted orders
    const incomingOrders = user?.orders?.filter(order => order.orderStatus === 'pending').slice(0,5) || [];

    const acceptedOrders = user?.orders?.filter(order => ['accepted', 'preparing'].includes(order.orderStatus)).slice(0,5) || [];

    const dashboardStats = {
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue,
        avgRating: user?.profile?.rating,
        totalCustomers: 856,
        repeatCustomers: 342,
        avgOrderValue: avgOrderValue.toFixed(),
        topSellingItem: topSellingItem
    };

    const trendingItems = [
        { name: "Margherita Pizza", orders: 45, revenue: 6750, trend: "+12%" },
        { name: "Chicken Biryani", orders: 38, revenue: 5320, trend: "+8%" },
        { name: "Paneer Butter Masala", orders: 28, revenue: 3360, trend: "+15%" },
        { name: "Chocolate Brownie", orders: 22, revenue: 1540, trend: "+22%" }
    ];

    const handleOrderClick = (order, type) => {
        setSelectedOrder(order);
        setOrderType(type);
        setShowOrderModal(true);
    };

    const handleStatusUpdate = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const confirmStatusUpdate = (order) => {
        outForDeliveryMutation.mutate(order?._id);
    };

    const handleAcceptOrder = () => {
        acceptOrderMutation.mutate(selectedOrder._id);
    };

    const handleRejectOrder = () => {
        console.log('Reject order:', selectedOrder._id);
        setShowOrderModal(false);
    };

    // const formatDate = (date) => {
    //     return new Date(date).toLocaleDateString('en-IN', {
    //         day: 'numeric',
    //         month: 'short',
    //         hour: '2-digit',
    //         minute: '2-digit'
    //     });
    // };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'Pending', icon: Clock },
            accepted: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Accepted', icon: CheckCircle },
            preparing: { color: 'bg-purple-100 text-purple-700 border-purple-300', label: 'Preparing', icon: ChefHat },
            outForDelivery: { color: 'bg-indigo-100 text-indigo-700 border-indigo-300', label: 'Out for Delivery', icon: Truck }
        };
        return configs[status] || configs.pending;
    };
    
    return (
        <div className="space-y-8">
            {user.profile.isVerified ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Today's Orders</p>
                                    <p className="text-3xl font-bold text-blue-700 mt-1">{dashboardStats.todayOrders}</p>
                                    <p className="text-sm text-blue-500 mt-1">+{getOrderChangePercent()}% from yesterday</p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-xl">
                                    <Package size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Today's Revenue</p>
                                    <p className="text-3xl font-bold text-green-700 mt-1">₹{dashboardStats.todayRevenue}</p>
                                    <p className="text-sm text-green-500 mt-1">+{calculateRevenueChangePercent()}% from yesterday</p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-xl">
                                    <DollarSign size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Average Rating</p>
                                    <p className="text-3xl font-bold text-orange-700 mt-1">{dashboardStats.avgRating}</p>
                                    <p className="text-sm text-orange-500 mt-1">{user?.profile?.reviews?.length || 0} reviews</p>
                                </div>
                                <div className="p-3 bg-orange-500 rounded-xl">
                                    <Star size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Status</p>
                                    <p className="text-lg font-bold text-purple-700 mt-1">
                                        {user?.profile?.isOpen ? 'Open' : 'Closed'}
                                    </p>
                                    <p className="text-sm text-purple-500 mt-1">Peak: {calculatePeakHours(user?.orders)}</p>
                                </div>
                                <div className="p-3 bg-purple-500 rounded-xl">
                                    <Activity size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Orders Section - Takes 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Incoming Orders */}
                            <div className="bg-white rounded-2xl min-h-[20vh] border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-100 rounded-xl">
                                            <AlertCircle size={24} className="text-yellow-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">Incoming Orders</h2>
                                            <p className="text-sm text-gray-500">New orders awaiting acceptance</p>
                                        </div>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                                        {user?.orders?.filter(order => order.orderStatus === "pending").length} Pending
                                    </span>
                                </div>
                                
                                <div className="space-y-4">
                                    {incomingOrders.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Package size={48} className="mx-auto mb-3 text-gray-300" />
                                            <p>No incoming orders</p>
                                        </div>
                                    ) : (
                                        incomingOrders.map((order) => (
                                            <div key={order._id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200 hover:border-yellow-300 transition-all cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                                                            <ShoppingBag size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 animate-pulse">
                                                                    NEW
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 font-medium">{order.customer_id?.customerName || 'Customer'}</p>
                                                            <p className="text-sm font-bold text-gray-800">₹{order.totalAmount} • {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOrderClick(order, 'incoming')}
                                                        className="flex cursor-pointer items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                        <span>View</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Accepted Orders */}
                        <div className="bg-white lg:col-span-2 rounded-2xl min-h-[20vh] border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-xl">
                                        <ChefHat size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Accepted Orders</h2>
                                        <p className="text-sm text-gray-500">Orders in progress</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('orders')} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium">
                                    View All
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {acceptedOrders.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <CheckCircle size={48} className="mx-auto mb-3 text-gray-300" />
                                        <p>No accepted orders</p>
                                    </div>
                                ) : (
                                    acceptedOrders.map((order) => {
                                        const statusConfig = getStatusConfig(order.orderStatus);
                                        const StatusIcon = statusConfig.icon;
                                        return (
                                            <div key={order._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                                                            <ShoppingBag size={16} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                                                                <span className={`px-2 py-1 text-xs font-bold rounded-full border ${statusConfig.color} flex items-center gap-1`}>
                                                                    <StatusIcon size={12} />
                                                                    {statusConfig.label}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{order.customer_id?.customerName || 'Customer'}</p>
                                                            <p className="text-sm font-medium text-gray-800">₹{order.totalAmount} • {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {console.log(order)}
                                                        {order.orderStatus != "outForDelivery" && <button
                                                            onClick={() => handleStatusUpdate(order)}
                                                            className="flex items-center cursor-pointer space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                                                        >
                                                            <Truck size={16} />
                                                            <span>Out for Delivery</span>
                                                        </button>}
                                                        <button
                                                            onClick={() => handleOrderClick(order, 'accepted')}
                                                            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                            <span>View</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <StatusUpdateModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onConfirm={confirmStatusUpdate}
                                order={selectedOrder}
                            />
                        </div>

                        {/* Trending Items */}
                        <div className="bg-white col-span-2 rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-orange-100 rounded-xl">
                                        <TrendingUp size={24} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Trending Items</h3>
                                        <p className="text-sm text-gray-500">Most popular today</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {trendingItems.slice(0, 3).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.orders} orders</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600 text-sm">{item.trend}</p>
                                                <p className="text-xs text-gray-500">₹{item.revenue}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-white col-span-2 rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-100 rounded-xl">
                                        <Target size={24} className="text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Performance</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Most Selling Item</span>
                                        <span className="font-bold text-gray-800">{dashboardStats.topSellingItem}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Avg Order Value</span>
                                        <span className="font-bold text-gray-800">₹{dashboardStats.avgOrderValue}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Peak Hour</span>
                                        <span className="font-bold text-gray-800">{calculatePeakHours()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Repeat Customers</span>
                                        <span className="font-bold text-green-600">{Math.round((dashboardStats.repeatCustomers / dashboardStats.totalCustomers) * 100)}%</span>
                                    </div>
                                </div>
                        </div>
                    </div>

                    {/* Order Details Modal */}
                    {showOrderModal && selectedOrder && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-3xl no-scrollbar max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h2>
                                            <p className="text-gray-600">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowOrderModal(false)}
                                            className="w-12 h-12 hover:bg-gray-200 rounded-xl transition-colors duration-300 flex items-center justify-center"
                                        >
                                            <X className="h-6 w-6 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6 grid grid-cols-2 gap-2">
                                    {/* Customer Info */}
                                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                            <User className="h-5 w-5 mr-2 text-blue-600" />
                                            Customer Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-semibold text-gray-800">{selectedOrder.customer_id?.customerName || 'Customer Name'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-semibold text-gray-800 flex items-center">
                                                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                                                    {'+91 ' + selectedOrder.customer_id?.phone || '+91 XXXXXXXXXX'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                                            <MapPin className="h-5 w-5 mr-2 text-green-600" />
                                            Delivery Address
                                        </h3>
                                        <p className="text-gray-700">
                                            {selectedOrder.deliveryAddress?.landmark}<br/>
                                            {selectedOrder.deliveryAddress?.street}<br />
                                            {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}
                                        </p>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                            <ShoppingBag className="h-5 w-5 mr-2 text-orange-600" />
                                            Order Items
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white rounded-xl p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${item.foodItem?.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{item.foodItem?.name || 'Food Item'}</p>
                                                            <p className="text-sm text-gray-600">Qty: {item.quantity} • ₹{item.price} each</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-bold text-orange-600">₹{item.subtotal || (item.price * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-semibold">₹{selectedOrder.totalAmount}</span>
                                            </div>
                                            {selectedOrder.deliveryFee > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Delivery Fee</span>
                                                    <span className="font-semibold">₹{selectedOrder.deliveryFee}</span>
                                                </div>
                                            )}
                                            <div className="pt-3 border-t border-gray-300">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-gray-800">Total Amount</span>
                                                    <span className="font-bold text-orange-600 text-xl">₹{selectedOrder.finalAmount || selectedOrder.totalAmount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Instructions */}
                                    {selectedOrder.special_instructions && (
                                        <div className="bg-purple-50 col-span-2 rounded-2xl p-6 border border-purple-200">
                                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                                                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                                                Special Instructions
                                            </h3>
                                            <p className="text-gray-700">{selectedOrder.special_instructions}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        {orderType === 'incoming' ? (
                                            <>
                                                <button
                                                    onClick={handleAcceptOrder}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                                                >
                                                    <CheckCircle className="h-6 w-6" />
                                                    <span>Accept Order</span>
                                                </button>
                                                <button
                                                    onClick={handleRejectOrder}
                                                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                                                >
                                                    <XCircle className="h-6 w-6" />
                                                    <span>Reject Order</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setShowOrderModal(false)}
                                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg transition-colors duration-300"
                                            >
                                                Close
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <VerificationBanner />
            )}
        </div>
    );
};

export default Overview;