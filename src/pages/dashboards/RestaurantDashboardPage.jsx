import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//Icons and Toast
import { 
  Utensils, Banknote, FileText, Settings, Home, Clock, Star, 
  MapPin, DollarSign, Package, Menu, X,
  Phone, Mail, CheckCircle
} from "lucide-react";
import { TbLogout } from "react-icons/tb";
import toast from 'react-hot-toast';

//API Function and Zustand store
import useAuthStore from '../../store/useAuthStore';
import { restaurantLogout } from '../../api/restaurantApi';

const RestaurantDashboardPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Get restaurant data from Zustand store
    const { user, clearUser } = useAuthStore();

    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const restaurantLogoutMutation = useMutation({
      mutationFn: restaurantLogout,
      onSuccess: () => {
          toast.success("Logged out successfully!");
          queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
          clearUser();
          setTimeout(() => navigate("/restaurant/login"), 0);
      },
      onError: (error) => {
          toast.error(error.response.data?.message || "Something went wrong");
      }
    });

    // Mock orders data for demo (you can replace this with actual orders from API)
    const ordersData = [
        {
          id: '1012',
          items: 2,
          price: '550',
          eta: '15 min',
          distance: '1.2 km',
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
          status: 'Preparing'
        },
        {
          id: '1011',
          items: 4,
          price: '820',
          eta: '20 min',
          distance: '2.5 km',
          color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
          status: 'Confirmed'
        },
        {
          id: '1010',
          items: 1,
          price: '240',
          eta: '10 min',
          distance: '0.8 km',
          color: 'bg-gradient-to-r from-purple-500 to-pink-600',
          status: 'Ready'
        }
    ];

    // Navigation items
    const navItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'info', label: 'Restaurant Info', icon: Utensils },
        { id: 'bank', label: 'Bank Details', icon: Banknote },
        { id: 'docs', label: 'Documents', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    // Auto-close sidebar on mobile when tab changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [activeTab]);

    // Format time from 24hr to 12hr format
    const formatTime = (time24) => {
        if (!time24) return 'N/A';
        const [hours, minutes] = time24.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Components for each tab
    const Overview = () => {
        const OrderCard = ({ order }) => (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg group">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`text-white p-3 rounded-xl ${order.color} shadow-lg`}>
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-800">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.items} items • ₹{order.price}</p>
                            <span className="inline-block px-3 py-1 mt-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                {order.status}
                            </span>
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
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-medium">
                            View Details
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-colors text-sm font-medium">
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm p-6 rounded-2xl border border-orange-200/50 hover:border-orange-300 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Rating</p>
                                <p className="text-3xl font-bold text-orange-700 mt-1">{user?.profile.rating || 0}</p>
                            </div>
                            <div className="p-3 bg-orange-500/20 rounded-xl">
                                <Star size={24} className="text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Orders Today</p>
                                <p className="text-3xl font-bold text-blue-700 mt-1">12</p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Package size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-sm p-6 rounded-2xl border border-green-200/50 hover:border-green-300 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Earnings Today</p>
                                <p className="text-3xl font-bold text-green-700 mt-1">₹2,450</p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <DollarSign size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 hover:border-purple-300 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Status</p>
                                <p className="text-lg font-bold text-purple-700 mt-1">
                                    {user?.profile.isOpen ? 'Open' : 'Closed'}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Clock size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 rounded-xl">
                            <Package size={24} className="text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
                    </div>
                    <div className="space-y-4">
                        {ordersData.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const RestaurantInfo = () => (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-xl">
                    <Utensils size={24} className="text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Restaurant Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Restaurant Name</label>
                        <p className="text-xl font-bold text-gray-800 mt-1">{user?.profile.restaurantName}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cuisines</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user?.profile.cuisines?.map((cuisine, index) => (
                                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                    {cuisine}
                                </span>
                            ))}
                        </div>
                    </div>
                      
                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact</label>
                        <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-500" />
                                <p className="text-gray-800">{user?.profile.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-500" />
                                <p className="text-gray-800">{user?.profile.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Operating Hours</label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Opens at:</span>
                                <span className="font-bold text-gray-800">{formatTime(user?.profile.openingTime)}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-gray-700">Closes at:</span>
                                <span className="font-bold text-gray-800">{formatTime(user?.profile.closingTime)}</span>
                            </div>
                        </div>
                    </div>
                            
                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-xl space-y-1">
                            <p className="text-gray-800">{user?.profile.address?.street}</p>
                            <p className="text-gray-800">{user?.profile.address?.city}, {user?.profile.address?.state}</p>
                            <p className="text-gray-800">PIN: {user?.profile.address?.pincode}</p>
                        </div>
                    </div>
                            
                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Status</label>
                        <div className="mt-2">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                user?.profile.isOpen 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {user?.profile.isOpen ? 'Open for Orders' : 'Currently Closed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const BankDetails = () => (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-xl">
                    <Banknote size={24} className="text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                <p className="text-yellow-800 text-sm">
                    Bank details are securely encrypted. Contact support to update banking information.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Holder</label>
                        <p className="text-xl font-bold text-gray-800 mt-1">{user?.bankDetails.accountHolderName}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Number</label>
                        <p className="text-xl font-mono text-gray-800 mt-1">{user?.bankDetails.accountNumber}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Bank Name</label>
                        <p className="text-xl font-bold text-gray-800 mt-1">{user?.bankDetails.bankName}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">IFSC Code</label>
                        <p className="text-xl font-mono text-gray-800 mt-1">{user?.bankDetails.IFSC}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const Documents = () => (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-xl">
                    <FileText size={24} className="text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Legal Documents</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                    <div className="text-center">
                        <div className="p-3 bg-green-100 rounded-xl inline-block mb-4">
                            <FileText size={24} className="text-green-600" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">FSSAI License</h3>
                        <p className="text-sm text-gray-600 mb-4">Food Safety License</p>
                        {user?.profile.documents?.fssaiLicense ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Uploaded</span>
                            </div>
                        ) : (
                            <span className="text-red-600 text-sm">Not Uploaded</span>
                        )}
                    </div>
                </div>
                  
                <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                    <div className="text-center">
                        <div className="p-3 bg-green-100 rounded-xl inline-block mb-4">
                            <FileText size={24} className="text-green-600" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">GST Certificate</h3>
                        <p className="text-sm text-gray-600 mb-4">Tax Registration</p>
                        {user?.profile.documents?.gstCertificate ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Uploaded</span>
                            </div>
                        ) : (
                            <span className="text-red-600 text-sm">Not Uploaded</span>
                        )}
                    </div>
                </div>
                  
                <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                    <div className="text-center">
                        <div className="p-3 bg-green-100 rounded-xl inline-block mb-4">
                            <FileText size={24} className="text-green-600" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">PAN Card</h3>
                        <p className="text-sm text-gray-600 mb-4">Business PAN</p>
                        {user?.profile.documents?.panCard ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Uploaded</span>
                            </div>
                        ) : (
                            <span className="text-red-600 text-sm">Not Uploaded</span>
                        )}
                    </div>
                </div>
            </div>
                
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">License Information</h4>
                <div className="space-y-2 text-sm">
                    <p><span className="font-medium">FSSAI Number:</span> {user?.profile.licenseNumber.fssai}</p>
                    <p><span className="font-medium">GST Number:</span> {user?.profile.licenseNumber.gst}</p>
                </div>
            </div>
        </div>
    );

    const SettingsComponent = () => (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-xl">
                    <Settings size={24} className="text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            </div>

            <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Restaurant Status</h3>
                    <p className="text-gray-600 mb-4">Toggle your restaurant's availability for orders</p>
                    <button className={`px-6 py-3 cursor-pointer rounded-xl font-medium transition-colors ${
                        user?.profile.isOpen 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}>
                        {user?.profile.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
                    </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Profile Settings</h3>
                    <p className="text-gray-600 mb-4">Update your restaurant information and settings</p>
                    <button className="px-6 py-3 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
                        Update Profile
                    </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Account Information</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Account Created:</span> {new Date(user?.profile.createdAt).toLocaleDateString()}</p>
                        <p><span className="font-medium">Last Updated:</span> {new Date(user?.profile.updatedAt).toLocaleDateString()}</p>
                        <p><span className="font-medium">Restaurant ID:</span> {user?.profile._id}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Overview />;
            case 'info': return <RestaurantInfo />;
            case 'bank': return <BankDetails />;
            case 'docs': return <Documents />;
            case 'settings': return <SettingsComponent />;
            default: return <Overview />;
        }
    };

    const handleLogout = () => {
        restaurantLogoutMutation.mutate();
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside 
                className={`fixed lg:relative lg:translate-x-0 z-40 h-screen transition-all duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isHovered ? 'w-72' : 'w-20'} lg:w-20 lg:hover:w-72 group`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="h-full bg-white/90 backdrop-blur-sm shadow-2xl border-r border-gray-200/50 p-4 flex flex-col justify-center">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-8 px-2">
                        <div className="p-2 bg-orange-500 rounded-xl shadow-lg flex-shrink-0">
                            <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <h1 className={`text-xl font-bold text-gray-800 transition-all duration-300 ${
                        isHovered || sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                        } overflow-hidden whitespace-nowrap`}>
                            FlavorForge
                        </h1>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex cursor-pointer items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                                      activeTab === item.id
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                                >
                                    <Icon size={20} className="flex-shrink-0" />
                                    <span className={`font-medium transition-all duration-300 ${
                                      isHovered || sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                                    } overflow-hidden whitespace-nowrap`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                    
                    {/* Restaurant Info in Sidebar */}
                    <div className={`border-t border-gray-200 pt-4 flex justify-between items-center transition-all duration-300 ${isHovered || sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="px-2">
                            <p className="text-lg font-bold text-gray-800 truncate">{user?.profile.restaurantName}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.profile.email}</p>
                        </div>
                        <button onClick={handleLogout}>
                            <TbLogout className='cursor-pointer hover:bg-orange-500 p-1 rounded-lg hover:text-white hover:transition-all' size={35} />
                        </button>
                    </div>
                </div>
            </aside>
              
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 lg:ml-0 ml-16">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Welcome back, {user?.profile.restaurantName}!
                        </h1>
                        <p className="text-gray-600">
                            Here's what's happening with your restaurant today.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="lg:ml-0 ml-16">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RestaurantDashboardPage;