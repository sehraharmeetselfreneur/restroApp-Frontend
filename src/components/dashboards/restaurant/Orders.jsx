import { Clock, MapPin, Package, ShoppingBag } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";
import VerificationBanner from "./VerificationBanner";

const Orders = ({ recentOrders }) => {
    const { user } = useAuthStore();

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
                            <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>All Orders</option>
                                <option>Pending</option>
                                <option>Confirmed</option>
                                <option>Preparing</option>
                                <option>Ready</option>
                                <option>Delivered</option>
                            </select>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                                Export Orders
                            </button>
                        </div>
                    </div>
                
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${order.color} text-white shadow-sm`}>
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="text-lg font-bold text-gray-800">Order #{order.id}</p>
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                    order.status === 'Preparing' ? 'bg-orange-100 text-orange-700' :
                                                    order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 font-medium">{order.customerName}</p>
                                            <p className="text-sm text-gray-500">{order.items} items • ₹{order.price} • {order.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>{order.eta}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            <span>{order.distance}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
                                            Accept
                                        </button>
                                        <button className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-medium">
                                            View Details
                                        </button>
                                        <button className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium">
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <VerificationBanner />
            )}
        </div>
    );
};
export default Orders;