import { Activity, DollarSign, Package, ShoppingBag, Star, Target, TrendingUp } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

const Overview = ({ recentOrders }) => {
    const { user } = useAuthStore();

    const dashboardStats = {
        totalOrders: 1247,
        todayOrders: 32,
        weeklyRevenue: 45680,
        todayRevenue: 2840,
        avgRating: user?.rating || 4.7,
        totalCustomers: 856,
        repeatCustomers: 342,
        avgOrderValue: 385,
        peakHour: "7:00 PM",
        topSellingItem: "Margherita Pizza"
    };

    const trendingItems = [
        { name: "Margherita Pizza", orders: 45, revenue: 6750, trend: "+12%" },
        { name: "Chicken Biryani", orders: 38, revenue: 5320, trend: "+8%" },
        { name: "Paneer Butter Masala", orders: 28, revenue: 3360, trend: "+15%" },
        { name: "Chocolate Brownie", orders: 22, revenue: 1540, trend: "+22%" }
    ];
    
    return (
        <div className="space-y-8">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Today's Orders</p>
                            <p className="text-3xl font-bold text-blue-700 mt-1">{dashboardStats.todayOrders}</p>
                            <p className="text-sm text-blue-500 mt-1">+12% from yesterday</p>
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
                            <p className="text-sm text-green-500 mt-1">+8% from yesterday</p>
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
                            <p className="text-sm text-orange-500 mt-1">856 reviews</p>
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
                            <p className="text-sm text-purple-500 mt-1">Peak: 7-9 PM</p>
                        </div>
                        <div className="p-3 bg-purple-500 rounded-xl">
                            <Activity size={24} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <Package size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                                <p className="text-sm text-gray-500">Latest incoming orders</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                            View All
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${order.color} text-white shadow-sm`}>
                                            <ShoppingBag size={16} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-800">#{order.id}</p>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    order.status === 'Preparing' ? 'bg-orange-100 text-orange-700' :
                                                    order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{order.customerName}</p>
                                            <p className="text-sm font-medium text-gray-800">₹{order.price} • {order.items} items</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800">{order.eta}</p>
                                        <p className="text-xs text-gray-500">{order.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    {/* Trending Items */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
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
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-xl">
                                <Target size={24} className="text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Performance</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Avg Order Value</span>
                                <span className="font-bold text-gray-800">₹{dashboardStats.avgOrderValue}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Peak Hour</span>
                                <span className="font-bold text-gray-800">{dashboardStats.peakHour}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Repeat Customers</span>
                                <span className="font-bold text-green-600">{Math.round((dashboardStats.repeatCustomers / dashboardStats.totalCustomers) * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;