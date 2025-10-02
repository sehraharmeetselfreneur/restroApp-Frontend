import { Settings } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRestaurantProfile, updateRestaurantAvailability } from "../../../api/restaurantApi";
import toast from "react-hot-toast";

const SettingsComponent = () => {
    const { user, setUser } = useAuthStore();
    const queryClient = useQueryClient();

    const updateRestaurantAvailabilityMutation = useMutation({
        mutationFn: updateRestaurantAvailability,
        onSuccess: async (data) => {
            toast.success(data.message);
            setUser(await getRestaurantProfile(), "Restaurant");
            queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    })

    const handleRestaurantAvailability = () => {
        updateRestaurantAvailabilityMutation.mutate();
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <Settings size={24} className="text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                        <p className="text-gray-600">Manage your restaurant settings and preferences</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Restaurant Status</h3>
                                <p className="text-gray-600">Toggle your restaurant's availability for orders</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Current status: <span className={`font-medium ${user?.profile?.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                        {user?.profile?.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </p>
                            </div>
                            <button onClick={handleRestaurantAvailability} className={`px-6 py-3 cursor-pointer rounded-xl font-medium transition-all ${
                                user?.profile?.isOpen 
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                            }`}>
                                {user?.profile?.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Profile Settings</h3>
                                <p className="text-gray-600">Update your restaurant information and settings</p>
                            </div>
                            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-lg">
                                Update Profile
                            </button>
                        </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Notification Settings</h3>
                                <p className="text-gray-600">Manage your notification preferences</p>
                            </div>
                            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg">
                                Configure
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-lg">
                                <span className="text-sm font-medium text-gray-500">Account Created</span>
                                <p className="font-bold text-gray-800 mt-1">{new Date(user?.profile?.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg">
                                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                                <p className="font-bold text-gray-800 mt-1">{new Date(user?.profile?.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg md:col-span-2">
                                <span className="text-sm font-medium text-gray-500">Restaurant ID</span>
                                <p className="font-mono text-gray-800 mt-1 text-sm">{user?.profile?._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsComponent;