import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Icons
import { 
  Utensils, Banknote, FileText, Settings, Home, Clock, Star, 
  MapPin, DollarSign, Package, Menu, X, Phone, Mail, CheckCircle,
  User, ChevronDown, TrendingUp, Eye, ShoppingBag, Calendar,
  Plus, Edit2, Trash2, Search, Filter, Grid, List, Award,
  Users, Target, BarChart3, PieChart, Activity, Bell,
  ChefHat, Coffee, Salad, Pizza, CakeSlice, Beef
} from "lucide-react";
import { TbLogout } from "react-icons/tb";
import toast from 'react-hot-toast';

import MenuManagement from '../../components/dashboards/restaurant/MenuManagement';

// Mock API functions (replace with actual API)
import useAuthStore from '../../store/useAuthStore';
import { restaurantLogout } from '../../api/restaurantApi';
import Overview from '../../components/dashboards/restaurant/Overview';
import Orders from '../../components/dashboards/restaurant/Orders';
import Analytics from '../../components/dashboards/restaurant/Analytics';
import RestaurantInfo from '../../components/dashboards/restaurant/RestaurantInfo';
import BankDetails from '../../components/dashboards/restaurant/BankDetails';
import Documents from '../../components/dashboards/restaurant/Documents';
import SettingsComponent from '../../components/dashboards/restaurant/SettingsComponent';

const RestaurantDashboardPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user, clearUser } = useAuthStore();

    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem("restaurantDashboardActiveTab");
        return saved ? saved : 'overview';
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        localStorage.setItem("restaurantDashboardActiveTab", activeTab);
    }, [activeTab]);

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

    const recentOrders = [
        {
            id: '1012', customerName: 'Rahul Sharma', items: 2, price: 550,
            eta: '15 min', distance: '1.2 km', status: 'Preparing',
            color: 'bg-gradient-to-r from-orange-500 to-red-500', time: '2 min ago'
        },
        {
            id: '1011', customerName: 'Priya Singh', items: 4, price: 820,
            eta: '20 min', distance: '2.5 km', status: 'Confirmed',
            color: 'bg-gradient-to-r from-blue-500 to-cyan-500', time: '5 min ago'
        },
        {
            id: '1010', customerName: 'Amit Kumar', items: 1, price: 240,
            eta: '10 min', distance: '0.8 km', status: 'Ready',
            color: 'bg-gradient-to-r from-green-500 to-emerald-500', time: '8 min ago'
        }
    ];

    const menuItems = [
        {
            id: 1, name: "Margherita Pizza", category: "Pizza", price: 299,
            image: "/api/placeholder/150/150", available: true, orders: 45,
            description: "Fresh tomatoes, mozzarella, and basil"
        },
        {
            id: 2, name: "Chicken Biryani", category: "Indian", price: 399,
            image: "/api/placeholder/150/150", available: true, orders: 38,
            description: "Aromatic basmati rice with tender chicken"
        },
        {
            id: 3, name: "Caesar Salad", category: "Salads", price: 199,
            image: "/api/placeholder/150/150", available: false, orders: 15,
            description: "Crispy romaine with parmesan and croutons"
        },
        {
            id: 4, name: "Chocolate Brownie", category: "Desserts", price: 149,
            image: "/api/placeholder/150/150", available: true, orders: 22,
            description: "Rich chocolate brownie with vanilla ice cream"
        }
    ];

    const navItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'menu', label: 'Menu Management', icon: ChefHat },
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'info', label: 'Restaurant Info', icon: Utensils },
        { id: 'bank', label: 'Bank Details', icon: Banknote },
        { id: 'docs', label: 'Documents', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    useEffect(() => {
        setSidebarOpen(false);
    }, [activeTab]);

    const formatTime = (time24) => {
        if (!time24) return 'N/A';
        const [hours, minutes] = time24.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${ampm}`;
    };

    const handleLogout = () => {
        restaurantLogoutMutation.mutate();
    };

    // Profile Modal Component
    const ProfileModal = () => (
        showProfile && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                                    <User size={32} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{user?.profile?.restaurantName}</h2>
                                    <p className="text-gray-600">{user?.profile?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Owner Name</label>
                                <p className="text-lg font-bold text-gray-800 mt-1">{user?.profile?.ownerName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                                <p className="text-lg font-bold text-gray-800 mt-1">{user?.profile?.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Rating</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Star className="w-5 h-5 text-orange-400 fill-current" />
                                    <span className="text-lg font-bold text-gray-800">{user?.profile?.rating || 0}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${user?.profile?.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`font-bold ${user?.profile?.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                        {user?.profile?.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</label>
                            <p className="text-gray-800 mt-2 leading-relaxed">{user?.profile?.description || 'No description available'}</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cuisines</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user?.profile?.cuisines?.map((cuisine, index) => (
                                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                        {cuisine}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
                            <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                                <p className="text-gray-800">{user?.profile?.address?.street}</p>
                                <p className="text-gray-800">{user?.profile?.address?.city}, {user?.profile?.address?.state}</p>
                                <p className="text-gray-800">PIN: {user?.profile?.address?.pincode}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Opening Time</label>
                                <p className="text-lg font-bold text-gray-800 mt-1">{formatTime(user?.profile?.openingTime)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Closing Time</label>
                                <p className="text-lg font-bold text-gray-800 mt-1">{formatTime(user?.profile?.closingTime)}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                            <button className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium">
                                Edit Profile
                            </button>
                            <button 
                                onClick={() => setShowProfile(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Overview user={user} recentOrders={recentOrders} />;
            case 'menu': return <MenuManagement />;
            case 'orders': return <Orders recentOrders={recentOrders} />;
            case 'analytics': return <Analytics dashboardStats={dashboardStats} trendingItems={trendingItems} />;
            case 'info': return <RestaurantInfo />;
            case 'bank': return <BankDetails />;
            case 'docs': return <Documents />;
            case 'settings': return <SettingsComponent />;
            default: return <Overview user={user} recentOrders={recentOrders} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Profile Button - Top Right */}
            <button
                onClick={() => setShowProfile(true)}
                className="fixed cursor-pointer top-4 right-4 z-40 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
            >
                <User size={24} className="text-gray-700" />
            </button>

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 lg:translate-x-0 z-40 h-full transition-all duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isHovered ? 'w-72' : 'w-20'} lg:w-20 lg:hover:w-72 group`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="h-full bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-200/50 p-4 flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-8 px-2">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg flex-shrink-0">
                            <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <h1 className={`text-xl font-bold text-gray-800 ml-3 transition-all duration-300 ${
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
                                    className={`w-full flex cursor-pointer items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                                        activeTab === item.id
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md'
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
                    <div className={`border-t border-gray-200 pt-4 transition-all duration-300 ${
                        isHovered || sidebarOpen ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <div className="flex items-center justify-between px-2">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-800 truncate">{user?.profile?.restaurantName}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.profile?.email}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-100 cursor-pointer hover:text-red-600 rounded-lg transition-all flex-shrink-0"
                                title="Logout"
                            >
                                <TbLogout size={20} />
                            </button>
                        </div>
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
                    <div className="mb-8 lg:ml-0 ml-16 mr-16 lg:mr-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    Welcome back, {user?.profile?.restaurantName || 'Chef'}!
                                </h1>
                                <p className="text-gray-600">
                                    Here's what's happening with your restaurant today.
                                </p>
                            </div>
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                                    <Calendar size={16} className="text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {new Date().toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:ml-0 ml-16 mr-16 lg:mr-0">
                        {renderContent()}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <ProfileModal />
        </div>
    );
};

export default RestaurantDashboardPage;