import { BarChart3, DollarSign, Package, Star, Users } from "lucide-react";
import VerificationBanner from "./VerificationBanner";
import useAuthStore from "../../../store/useAuthStore";

const Analytics = ({ dashboardStats, trendingItems }) => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            {user.profile.isVerified ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <BarChart3 size={24} className="text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
                        <p className="text-gray-600">Detailed insights about your restaurant performance</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="p-3 bg-blue-500 rounded-xl inline-block mb-4">
                            <Package size={24} className="text-white" />
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{dashboardStats.totalOrders}</p>
                        <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                        <div className="p-3 bg-green-500 rounded-xl inline-block mb-4">
                            <DollarSign size={24} className="text-white" />
                        </div>
                        <p className="text-2xl font-bold text-green-700">₹{dashboardStats.weeklyRevenue}</p>
                        <p className="text-sm text-green-600 font-medium">Weekly Revenue</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                        <div className="p-3 bg-orange-500 rounded-xl inline-block mb-4">
                            <Users size={24} className="text-white" />
                        </div>
                        <p className="text-2xl font-bold text-orange-700">{dashboardStats.totalCustomers}</p>
                        <p className="text-sm text-orange-600 font-medium">Total Customers</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                        <div className="p-3 bg-purple-500 rounded-xl inline-block mb-4">
                            <Star size={24} className="text-white" />
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{dashboardStats.avgRating}</p>
                        <p className="text-sm text-purple-600 font-medium">Average Rating</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Performing Items</h3>
                        <div className="space-y-4">
                            {trendingItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.orders} orders</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">₹{item.revenue}</p>
                                        <p className="text-sm text-green-600 font-medium">{item.trend}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Metrics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-gray-600">Average Order Value</span>
                                <span className="font-bold text-gray-800">₹{dashboardStats.avgOrderValue}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-gray-600">Peak Hour</span>
                                <span className="font-bold text-gray-800">{dashboardStats.peakHour}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-gray-600">Customer Retention</span>
                                <span className="font-bold text-green-600">{Math.round((dashboardStats.repeatCustomers / dashboardStats.totalCustomers) * 100)}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-gray-600">Order Completion Rate</span>
                                <span className="font-bold text-green-600">97.5%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) : (
                <VerificationBanner />
            )}
        </div>
    );
};

export default Analytics;