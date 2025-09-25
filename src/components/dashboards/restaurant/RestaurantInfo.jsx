import { Mail, Phone, Utensils } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

const RestaurantInfo = () => {
    const { user } = useAuthStore();

    const formatTime = (time24) => {
        if (!time24) return 'N/A';
        const [hours, minutes] = time24.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-100 rounded-xl">
                    <Utensils size={24} className="text-orange-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Restaurant Information</h2>
                    <p className="text-gray-600">Your restaurant's basic information and settings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Restaurant Name</label>
                        <p className="text-xl font-bold text-gray-800 mt-2">{user?.profile?.restaurantName}</p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Owner Name</label>
                        <p className="text-xl font-bold text-gray-800 mt-2">{user?.profile?.ownerName}</p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cuisines</label>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {user?.profile?.cuisines?.map((cuisine, index) => (
                                <span key={index} className="px-3 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-medium">
                                    {cuisine}
                                </span>
                            ))}
                        </div>
                    </div>
                      
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Information</label>
                        <div className="space-y-3 mt-3">
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-500" />
                                <p className="text-gray-800 font-medium">+91-{user?.profile?.phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-500" />
                                <p className="text-gray-800 font-medium">{user?.profile?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Operating Hours</label>
                        <div className="mt-3 space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <span className="text-gray-700 font-medium">Opening Time</span>
                                <span className="font-bold text-gray-800">{formatTime(user?.profile?.openingTime)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <span className="text-gray-700 font-medium">Closing Time</span>
                                <span className="font-bold text-gray-800">{formatTime(user?.profile?.closingTime)}</span>
                            </div>
                        </div>
                    </div>
                            
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
                        <div className="mt-3 p-4 bg-white rounded-lg space-y-1">
                            <p className="text-gray-800 font-medium">{user?.profile?.address?.street}</p>
                            <p className="text-gray-800">{user?.profile?.address?.city}, {user?.profile?.address?.state}</p>
                            <p className="text-gray-800">PIN: {user?.profile?.address?.pincode}</p>
                        </div>
                    </div>
                            
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Status</label>
                        <div className="mt-3">
                            <span className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium ${
                                user?.profile?.isOpen 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                    user?.profile?.isOpen ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                {user?.profile?.isOpen ? 'Open for Orders' : 'Currently Closed'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</label>
                        <p className="text-gray-800 mt-3 leading-relaxed">{user?.profile?.description || 'No description available'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfo;