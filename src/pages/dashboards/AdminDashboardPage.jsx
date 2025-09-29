import React, { useEffect, useState } from "react";
import {
  Users,
  Store,
  LogOut,
  Settings,
  Search,
  Filter,
  LayoutDashboard,
  UserCircle,
  ChefHat,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  Clock,
  AlertTriangle,
  Bell,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  CreditCard,
  Package,
  Truck,
  MessageSquare,
  Award,
  Target,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Pause,
  FileText,
  Camera,
  Clock4,
  Building2,
  ChefHat as MenuIcon,
  IndianRupee,
  ImageIcon,
  MapPinIcon,
  Calendar as CalendarIcon,
  User2,
  BadgeCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  FileCheck,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../store/useAuthStore";
import { approveRestaurant, getAllCustomers, getAllOrders, getAllRestaurants, logoutAdmin, rejectRestaurant } from "../../api/adminApi";
import toast from "react-hot-toast";

const AdminDashboardPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { user, clearUser } = useAuthStore();
    const admin = user.profile;

    const [allRestaurants, setAllRestaurants] = useState([]);
    const [restaurantCount, setRestaurantCount] = useState(0);
    const [approvedRestaurantTodayCount, setApprovedRestaurantTodayCount] = useState(0);
    const [rejectedRestaurantCount, setRejectedRestaurantCount] = useState(0)
    const [verificationNotes, setVerificationNotes] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState(() => {
        const saved = localStorage.getItem("adminSelectedRestaurant");
        return saved ? JSON.parse(saved) : null;
    });
    const [selectedRestaurantMenu, setSelectedRestaurantMenu] = useState({
        menu: selectedRestaurant?.menu,
        items: selectedRestaurant?.foodItems
    });

    const [allCustomers, setAllCustomers] = useState([]);
    const [customersCount, setCustomersCount] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState(() => {
        const saved = localStorage.getItem("adminSelectedCustomer");
        return saved ? JSON.parse(saved) : null;
    });

    const [allOrders, setAllOrders] = useState([]);
    const [allOrdersCount, setAllOrdersCount] = useState(0);

    //Unverified Restaurants
    const [unverifiedRestaurants, setUnverifiedRestaurants] = useState(allRestaurants.filter(r => r.isVerified === false));

    const recalcUnverified = () => {
      setUnverifiedRestaurants(allRestaurants.filter(r => !r.isVerified));
    };

    useEffect(() => {
      setUnverifiedRestaurants(allRestaurants.filter(r => r.isVerified === false));
    }, [allRestaurants]);

    useEffect(() => {
      // Get current time
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // next midnight
  
      // Time left until midnight
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
  
      // Reset at midnight
      const timeout = setTimeout(() => {
        setApprovedRestaurantTodayCount(0);
  
        // From now on, reset every 24h
        setInterval(() => {
          setApprovedRestaurantTodayCount(0);
        }, 24 * 60 * 60 * 1000);
      }, timeUntilMidnight);
      return () => clearTimeout(timeout);
    }, []);

    const getAllRestaurantMutation = useMutation({
        mutationFn: getAllRestaurants,
        onSuccess: (data) => {
            setRestaurantCount(data.restaurantCount);
            setAllRestaurants(data.restaurants);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const approveRestaurantMutation = useMutation({
        mutationFn: approveRestaurant,
        onSuccess: () => {
            toast.success("Restaurant approved successfully!");
            setSelectedRestaurant(null);
            recalcUnverified();
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const rejectRestaurantMutation = useMutation({
        mutationFn: rejectRestaurant,
        onSuccess: () => {
            toast.success("Restaurant rejected successfully!");
            setSelectedRestaurant(null);
            recalcUnverified();
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    })

    const getAllCustomersMutation = useMutation({
        mutationFn: getAllCustomers,
        onSuccess: (data) => {
            setAllCustomers(data.customers);
            setCustomersCount(data.customersCount);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const getAllOrdersMutation = useMutation({
        mutationFn: getAllOrders,
        onSuccess: (data) => {
            setAllOrders(data.orders);
            setAllOrdersCount(data.ordersCount);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const logoutAdminMutation = useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            toast.success("Logged out successfully");
            queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
            clearUser();
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const handleRestaurantApprove = () => {
        approveRestaurantMutation.mutate({ isVerified: true, restaurantId: selectedRestaurant._id });
        setApprovedRestaurantTodayCount(prev => prev+1);
    }

    const handleRestaurantReject = () => {
        rejectRestaurantMutation.mutate({ isVerified: false, restaurantId: selectedRestaurant._id });
        setRejectedRestaurantCount(prev => prev+1);
    }

    useEffect(() => {
        getAllRestaurantMutation.mutate();
        getAllCustomersMutation.mutate();
        getAllOrdersMutation.mutate();
    }, []);

    const [filter, setFilter] = useState("");
    const [timeRange, setTimeRange] = useState("7d");
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem("adminDashboardActiveTab");
        return saved ? saved : "dashboard";
    });

    useEffect(() => {
        localStorage.setItem("adminDashboardActiveTab", activeTab);
        localStorage.setItem("adminSelectedRestaurant", JSON.stringify(selectedRestaurant));
        localStorage.setItem("adminSelectedCustomer", JSON.stringify(selectedCustomer));
    }, [activeTab, selectedRestaurant, selectedCustomer]);

    // Enhanced dummy data
    const stats = {
      totalRevenue: "₹2,45,680",
      totalOrders: "1,847",
      totalRestaurants: "156",
      totalCustomers: "8,429",
      activeOrders: "73",
      completedToday: "234",
      avgRating: "4.6",
      newRegistrations: "23"
    };

    const recentOrders = [
      { id: "#ORD001", customer: "John Doe", restaurant: "Spice Garden", amount: "₹485", status: "delivered", time: "2 min ago" },
      { id: "#ORD002", customer: "Jane Smith", restaurant: "Pizza Corner", amount: "₹720", status: "preparing", time: "5 min ago" },
      { id: "#ORD003", customer: "Mike Johnson", restaurant: "Burger Hub", amount: "₹320", status: "pending", time: "8 min ago" },
      { id: "#ORD004", customer: "Sarah Wilson", restaurant: "Spice Garden", amount: "₹680", status: "on_way", time: "12 min ago" },
    ];

    const notifications = [
      { type: "warning", message: "3 restaurants pending verification", time: "10 min ago" },
      { type: "info", message: "System maintenance scheduled", time: "1 hour ago" },
      { type: "success", message: "Payment system updated", time: "2 hours ago" },
    ];

    const getStatusBadge = (status) => {
      const styles = {
        true: "bg-green-100 text-green-800 border-green-200",
        false: "bg-red-100 text-red-800 border-red-200",
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        delivered: "bg-green-100 text-green-800 border-green-200",
        preparing: "bg-blue-100 text-blue-800 border-blue-200",
        on_way: "bg-purple-100 text-purple-800 border-purple-200"
      };
      return `px-2 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.pending}`;
    };

    const sidebarItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "restaurants", label: "Restaurants", icon: Store },
      { id: "verification", label: "Verification", icon: BadgeCheck },
      { id: "customers", label: "Customers", icon: Users },
      { id: "orders", label: "Orders", icon: ShoppingCart },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "payments", label: "Payments", icon: CreditCard },
      { id: "delivery", label: "Delivery", icon: Truck },
      { id: "reviews", label: "Reviews", icon: MessageSquare },
      { id: "promotions", label: "Promotions", icon: Award },
      { id: "settings", label: "Settings", icon: Settings },
    ];

    const filteredData = () => {
      switch (activeTab) {
        case "restaurants":
          return allRestaurants.filter(r => 
            r.address.city.toLowerCase().includes(filter.toLowerCase()) ||
            r.restaurantName.toLowerCase().includes(filter.toLowerCase())
          );
        case "customers":
          return allCustomers.filter(c => 
            c.address[0].city.toLowerCase().includes(filter.toLowerCase()) ||
            c.customerName.toLowerCase().includes(filter.toLowerCase())
          );
        case "orders":
          return recentOrders.filter(o => 
            o.customer.toLowerCase().includes(filter.toLowerCase()) ||
            o.restaurant.toLowerCase().includes(filter.toLowerCase())
          );
        default:
          return [];
      }
    };

    const handleLogout = () => {
        logoutAdminMutation.mutate();
    }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-orange-100/50 flex flex-col">
        <div className="p-6 border-b border-orange-100/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <ChefHat className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                FlavorForge Admin
              </h1>
              <p className="text-xs text-gray-500">Restaurant Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() =>{ setActiveTab(item.id); setSelectedRestaurant(null); }}
                className={`flex cursor-pointer items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    : "hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                }`}
              >
                <Icon size={18} className={`transition-transform duration-200 ${activeTab === item.id ? '' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {item.id === "orders" && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">73</span>
                )}
                {item.id === "verification" && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unverifiedRestaurants.length}</span>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-orange-100/50">
          <button onClick={handleLogout} className="flex cursor-pointer items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all w-full">
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-orange-100/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-800">
                {sidebarItems.find(item => item.id === activeTab)?.label || "Dashboard"}
              </h2>
              {activeTab === "dashboard" && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  Last updated: 2 min ago
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 hover:bg-orange-50 rounded-xl transition-colors relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
              </div>
              
              {/* Time Range Selector */}
              {activeTab === "dashboard" && (
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="1d">Today</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="3m">Last 3 months</option>
                </select>
              )}
              
              {/* Profile */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-xl shadow-lg">
                <UserCircle size={32} />
                <div className="text-right">
                  <p className="font-semibold">{admin.adminName}</p>
                  <p className="text-xs opacity-90">{admin.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue}</p>
                      <div className="flex items-center mt-2 text-green-600">
                        <TrendingUp size={16} />
                        <span className="text-sm ml-1">+12.5%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="text-white" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
                      <p className="text-3xl font-bold text-gray-900">{allOrdersCount}</p>
                      <div className="flex items-center mt-2 text-blue-600">
                        <TrendingUp size={16} />
                        <span className="text-sm ml-1">+8.2%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="text-white" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Restaurants</h3>
                      <p className="text-3xl font-bold text-gray-900">{restaurantCount}</p>
                      <div className="flex items-center mt-2 text-orange-600">
                        <Plus size={16} />
                        <span className="text-sm ml-1">+5 new</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <Store className="text-white" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Active Users</h3>
                      <p className="text-3xl font-bold text-gray-900">{customersCount}</p>
                      <div className="flex items-center mt-2 text-purple-600">
                        <Users size={16} />
                        <span className="text-sm ml-1">+{stats.newRegistrations} today</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
                    <button className="text-orange-600 hover:text-orange-700 font-medium">View All</button>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {order.id.slice(-2)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.customer}</p>
                            <p className="text-sm text-gray-500">{order.restaurant}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{order.amount}</p>
                          <p className="text-sm text-gray-500">{order.time}</p>
                        </div>
                        <span className={getStatusBadge(order.status)}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h3>
                  <div className="space-y-4">
                    {notifications.map((notif, idx) => (
                      <div key={idx} className="p-4 bg-gray-50/50 rounded-xl">
                        <div className="flex items-start gap-3">
                          {notif.type === "warning" && <AlertTriangle className="text-yellow-500 mt-0.5" size={16} />}
                          {notif.type === "info" && <Activity className="text-blue-500 mt-0.5" size={16} />}
                          {notif.type === "success" && <CheckCircle className="text-green-500 mt-0.5" size={16} />}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Restaurants Management */}
          {activeTab === "restaurants" && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className={`flex flex-col sm:flex-row gap-4 ${selectedRestaurant ? "hidden" : ""} justify-between items-start sm:items-center`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search restaurants..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-80 pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg">
                    <Filter size={16} />
                    Filters
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-3 bg-white border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition-all">
                    <Download size={16} />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg">
                    <Plus size={16} />
                    Add Restaurant
                  </button>
                </div>
              </div>
                  
              {/* Conditional rendering for restaurants */}
              {allRestaurants.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium text-lg">
                  No restaurants available for now.
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    {selectedRestaurant ? (
                        /* Detailed Restaurant */
                        <div className="space-y-6 p-5">
                          {/* Back Button and Header */}
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-end gap-4">
                              <h3 className="text-2xl font-bold text-gray-800">{selectedRestaurant.restaurantName}</h3>
                              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                                ID: {selectedRestaurant._id}
                              </span>
                            </div>
                            <button 
                              onClick={() => setSelectedRestaurant(null)}
                              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-gray-700 rounded-lg hover:bg-orange-50 transition-all"
                            >
                              ← Back to List
                            </button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Restaurant Details */}
                            <div className="lg:col-span-2 space-y-6">
                              {/* Basic Information */}
                              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                                <div className="flex items-center gap-3 mb-6">
                                  <Building2 className="text-orange-600" size={24} />
                                  <h4 className="text-xl font-semibold text-gray-800">Restaurant Information</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Restaurant Name</label>
                                    <p className="text-gray-900 font-medium">{selectedRestaurant.restaurantName}</p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                                    <p className="text-gray-900">{selectedRestaurant.cuisines[0]}</p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Owner Name</label>
                                    <p className="text-gray-900">{selectedRestaurant.ownerName}</p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Contact Number</label>
                                    <p className="text-gray-900">+91-{selectedRestaurant.phone}</p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                                    <p className="text-gray-900">{selectedRestaurant.email}</p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Geo-Location</label>
                                    <p className="text-gray-900">{selectedRestaurant.address.geoLocation.lat.toFixed(6)}, {selectedRestaurant.address.geoLocation.lng.toFixed(6)}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                                    <p className="text-gray-900">{selectedRestaurant.address.street}, {selectedRestaurant.address.city}, {selectedRestaurant.address.state}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                                    <p className="text-gray-700">{selectedRestaurant.description}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Business Details */}
                              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                                <div className="flex items-center gap-3 mb-6">
                                  <Clock4 className="text-orange-600" size={24} />
                                  <h4 className="text-xl font-semibold text-gray-800">Business Details</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Business Hours</label>
                                    <p className="text-gray-900">{selectedRestaurant.openingTime}-{selectedRestaurant.closingTime}</p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Delivery Radius</label>
                                    <p className="text-gray-900">{selectedRestaurant.deliveryRadius || "NA"}</p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Avg Prep Time</label>
                                    <p className="text-gray-900">{selectedRestaurant.avgPreparationTime || "NA"}</p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-600 mb-2">Cuisines</label>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedRestaurant.cuisines.map((cuisine, idx) => (
                                      <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                                        {cuisine}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                                
                            {/* Documents and Actions Sidebar */}
                            <div className="space-y-6">
                              {/* Documents */}
                              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                                <div className="flex items-center gap-3 mb-6">
                                  <FileText className="text-orange-600" size={24} />
                                  <h4 className="text-lg font-semibold text-gray-800">Documents</h4>
                                </div>
                                <div className="space-y-3">
                                  {Object.entries(selectedRestaurant.documents).slice(0, 3).map(([type, filename]) => (
                                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-gray-500" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-900 capitalize">
                                            {type.replace(/([A-Z])/g, ' $1').trim()}
                                          </p>
                                          <p className="text-xs text-gray-500">{filename?.split("\\").pop().split("-").slice(1).join("-") || "No file"}</p>
                                        </div>
                                      </div>
                                      <Link to={"http://localhost:5000/KYC" + filename?.split("KYC")[1]?.replace(/\\/g, "/")} target="_blank" className="p-1 hover:bg-gray-200 rounded text-blue-600">
                                        <ExternalLink size={14} />
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Orders */}
                              {selectedRestaurant.orders &&
                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Orders</h4>
                                  {selectedRestaurant.orders.length > 0  ? (
                                    <div className="space-y-3">
                                      {selectedRestaurant.orders.map((order, idx) => (
                                        <div
                                          key={order._id || idx}
                                          className="flex items-center justify-between border-b border-orange-100/50 pb-2 last:border-none"
                                        >
                                          {/* Left: Order ID */}
                                          <div>
                                            <p className="text-sm font-medium text-gray-700">Order ID: {order._id}</p>
                                            <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                                          </div>
                                        
                                          {/* Right: Amount */}
                                          <p className="text-sm font-semibold text-green-600">
                                            ₹{order.finalAmount?.toLocaleString() || 0}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50 text-center text-gray-500">
                                      No orders for now.
                                    </div>
                                  )}
                                </div>
                              }
                            </div>

                            {/* Menu Items */}
                            <div className="lg:col-span-3 space-y-6">
                              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                                <div className="flex items-center gap-3 mb-6">
                                  <MenuIcon className="text-orange-600" size={24} />
                                  <h4 className="text-xl font-semibold text-gray-800">Menu Items ({selectedRestaurant.cuisines.length || 0})</h4>
                                </div>
                                <div className={`${ selectedRestaurantMenu?.menu?.length ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "w-full"}`}>
                                  {selectedRestaurantMenu.menu && selectedRestaurantMenu.menu.length > 0 ? (
                                    selectedRestaurantMenu.menu.map((category, idx) => (
                                      <div key={idx} className="mb-6">
                                        {/* Category Title */}
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-orange-100 pb-1">
                                          {category}
                                        </h3>
                                  
                                        {/* Items under this category */}
                                        <div className="space-y-3">
                                          {selectedRestaurantMenu.items
                                            .filter((item) => item.category === category)
                                            .length > 0 ? (
                                            selectedRestaurantMenu.items
                                              .filter((item) => item.category === category)
                                              .map((item, i) => (
                                                <div
                                                  key={i}
                                                  className="flex gap-4 p-4 bg-gradient-to-r from-orange-50/30 to-amber-50/30 rounded-xl border border-orange-100/30"
                                                >
                                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="text-gray-400" size={20} />
                                                  </div>
                                                  <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-1">
                                                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                                                      <span className="font-semibold text-green-600">₹{item.price}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                  </div>
                                                </div>
                                              ))
                                          ) : (
                                            <p className="text-gray-500 text-sm">No items available in this category.</p>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-center text-gray-500 mt-6">This restaurant has no menu available.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    ) : (
                        // Table of All Restaurants
                        <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Restaurant</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Owner</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Location</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Rating</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Orders</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Revenue</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Status</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData().map((restaurant, idx) => (
                          <tr key={restaurant._id} onClick={() => setSelectedRestaurant(restaurant)} className="border-t cursor-pointer border-orange-100/50 hover:bg-orange-50/30 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-semibold">
                                  {restaurant.restaurantName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{restaurant.restaurantName}</p>
                                  <p className="text-sm text-gray-500">{restaurant.cuisines[0]}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col items-center">
                                <p className="font-medium text-gray-900">{restaurant.ownerName}</p>
                                <p className="text-sm text-gray-500">+91-{restaurant.phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="text-gray-900">{restaurant.address.city}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="text-yellow-400 fill-current" size={16} />
                                <span className="font-medium">{restaurant.rating}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="font-medium text-gray-900">{restaurant.orders.length || 0}</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="font-medium text-green-600">{restaurant.revenue || 0}</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={getStatusBadge(restaurant.isVerified)}>
                                {restaurant.isVerified ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                                  <Eye size={16} />
                                </button>
                                <button className="p-2 hover:bg-orange-50 rounded-lg text-orange-600 transition-colors">
                                  <Edit size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Restaurant Verification */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              {/* Verification Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock4 className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{unverifiedRestaurants.length}</p>
                      <p className="text-sm text-gray-600">Pending Review</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <ThumbsUp className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{approvedRestaurantTodayCount}</p>
                      <p className="text-sm text-gray-600">Approved Today</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <ThumbsDown className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{rejectedRestaurantCount}</p>
                      <p className="text-sm text-gray-600">Rejected</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileCheck className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{allRestaurants.filter(r => r.isVerified === true).length}</p>
                      <p className="text-sm text-gray-600">Total Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              {!selectedRestaurant ? (
                /* Pending Restaurants List */
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100/50 overflow-hidden">
                  <div className="p-6 border-b border-orange-100/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">Pending Verifications</h3>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-gray-700 rounded-lg hover:bg-orange-50 transition-all">
                          <Filter size={16} />
                          Filter
                        </button>
                        <select className="px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option>All Categories</option>
                          <option>Indian Cuisine</option>
                          <option>Italian Cuisine</option>
                          <option>Chinese Cuisine</option>
                          <option>Fast Food</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {unverifiedRestaurants.length === 0 ? (
                        <p className="text-gray-500 text-lg text-center font-medium">No Restaurants need verification for now.</p>
                    ) : (
                        unverifiedRestaurants.map((restaurant) => (
                      <div key={restaurant._id} className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 p-6 rounded-xl border border-orange-100/50 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                              {restaurant.restaurantName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{restaurant.restaurantName}</h4>
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                  {restaurant.cuisines[0]}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <User2 size={14} />
                                  <span>{restaurant.ownerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail size={14} />
                                  <span>{restaurant.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone size={14} />
                                  <span>+91-{restaurant.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CalendarIcon size={14} />
                                  <span>
                                    Submitted: {(() => {
                                                  const date = new Date(restaurant.createdAt);
                                                  const day = String(date.getDate()).padStart(2, "0");
                                                  const month = String(date.getMonth() + 1).padStart(2, "0");
                                                  const year = date.getFullYear();
                                                  return `${day}-${month}-${year}`;
                                                })()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPinIcon size={14} />
                                <span className="truncate">{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right text-sm">
                              <p className="text-gray-500">Menu Items</p>
                              <p className="font-semibold text-gray-900">{restaurant.cuisines.length}</p>
                            </div>
                            <button 
                              onClick={() => setSelectedRestaurant(restaurant)}
                              className="px-6 py-2 cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center gap-2"
                            >
                              <Eye size={16} />
                              Review
                            </button>
                          </div>
                        </div>
                        
                        {/* Preview of specialties */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {restaurant.cuisines.slice(0, 3).map((specialty, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/60 text-gray-700 text-xs rounded-full border border-orange-200/50">
                              {specialty}
                            </span>
                          ))}
                          {restaurant.cuisines.length > 3 && (
                            <span className="px-2 py-1 bg-white/60 text-gray-500 text-xs rounded-full border border-orange-200/50">
                              +{restaurant.cuisines.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                    )}
                  </div>
                </div>
              ) : (
                /* Detailed Restaurant Review */
                <div className="space-y-6">
                  {/* Back Button and Header */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedRestaurant(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-gray-700 rounded-lg hover:bg-orange-50 transition-all"
                    >
                      ← Back to List
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800">Restaurant Verification</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                      ID: {selectedRestaurant._id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Restaurant Details */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Basic Information */}
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                        <div className="flex items-center gap-3 mb-6">
                          <Building2 className="text-orange-600" size={24} />
                          <h4 className="text-xl font-semibold text-gray-800">Restaurant Information</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Restaurant Name</label>
                            <p className="text-gray-900 font-medium">{selectedRestaurant.restaurantName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                            <p className="text-gray-900">{selectedRestaurant.cuisines[0]} +{selectedRestaurant.cuisines.length - 1} more</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Owner Name</label>
                            <p className="text-gray-900">{selectedRestaurant.ownerName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Contact Number</label>
                            <p className="text-gray-900">+91-{selectedRestaurant.phone}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                            <p className="text-gray-900">{selectedRestaurant.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Geo-Location</label>
                            <p className="text-gray-900">{selectedRestaurant.address.geoLocation.coordinates[1].toFixed(6)}, {selectedRestaurant.address.geoLocation.coordinates[0].toFixed(6)}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                            <p className="text-gray-900">{selectedRestaurant.address.street}, {selectedRestaurant.address.city}, {selectedRestaurant.address.state}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                            <p className="text-gray-700">{selectedRestaurant.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Business Details */}
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                        <div className="flex items-center gap-3 mb-6">
                          <Clock4 className="text-orange-600" size={24} />
                          <h4 className="text-xl font-semibold text-gray-800">Business Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Business Hours</label>
                            <p className="text-gray-900">{selectedRestaurant.openingTime}-{selectedRestaurant.closingTime}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Delivery Radius</label>
                            <p className="text-gray-900">{selectedRestaurant.deliveryRadius || 0}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Avg Prep Time</label>
                            <p className="text-gray-900">{selectedRestaurant.avgPreparationTime || 0}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Specialties</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedRestaurant.cuisines.map((cuisine, idx) => (
                              <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                                {cuisine}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                        <div className="flex items-center gap-3 mb-6">
                          <MenuIcon className="text-orange-600" size={24} />
                          <h4 className="text-xl font-semibold text-gray-800">Menu Items ({selectedRestaurant.cuisines.length || 0})</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* {selectedRestaurant.menu.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-orange-50/30 to-amber-50/30 rounded-xl border border-orange-100/30">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ImageIcon className="text-gray-400" size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h5 className="font-medium text-gray-900">{item.name}</h5>
                                  <span className="font-semibold text-green-600">{item.price}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                          ))} */}
                        </div>
                      </div>
                    </div>

                    {/* Documents and Actions Sidebar */}
                    <div className="space-y-6">
                      {/* Documents */}
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="text-orange-600" size={24} />
                          <h4 className="text-lg font-semibold text-gray-800">Documents</h4>
                        </div>
                        <div className="space-y-3">
                          {Object.entries(selectedRestaurant.documents).map(([type, filename]) => (
                            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900 capitalize">
                                    {type.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-xs text-gray-500">{filename?.split("\\").pop().split("-").slice(1).join("-") || "No file"}</p>
                                </div>
                              </div>
                              <Link to={"http://localhost:5000/KYC" + filename?.split("KYC")[1]?.replace(/\\/g, "/")} target="_blank" className="p-1 hover:bg-gray-200 rounded text-blue-600">
                                <ExternalLink size={14} />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Social Media */}
                      {selectedRestaurant.socialMedia && (
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h4>
                          <div className="space-y-2">
                            {/* {Object.entries(selectedRestaurant.socialMedia).map(([platform, handle]) => (
                              <div key={platform} className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 capitalize">{platform}:</span>
                                <span className="text-sm text-blue-600">{handle}</span>
                              </div>
                            ))} */}
                          </div>
                        </div>
                      )}

                      {/* Verification Notes */}
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Verification Notes</h4>
                        <textarea
                          value={verificationNotes}
                          onChange={(e) => setVerificationNotes(e.target.value)}
                          placeholder="Add notes about this verification..."
                          className="w-full h-32 p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Actions</h4>
                        <div className="space-y-3">
                          <button onClick={handleRestaurantApprove} className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg">
                            <ThumbsUp size={16} />
                            {approveRestaurantMutation.isPending ? "Approving..." : "Approve Restaurant"}
                          </button>
                          <button className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
                            <AlertCircle size={16} />
                            Request More Info
                          </button>
                          <button onClick={handleRestaurantReject} className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all">
                            <ThumbsDown size={16} />
                            Reject Application
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customers Management */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className={`flex flex-col sm:flex-row ${selectedCustomer ? "hidden" : ""} gap-4 justify-between items-start sm:items-center`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-80 pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg">
                    <Filter size={16} />
                    Filters
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition-all">
                  <Download size={16} />
                  Export
                </button>
              </div>

              {/* Customers Table */}
              {selectedCustomer ? (
                <div className="space-y-6">
                  {/* Back Button and Header */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-end gap-4">
                      <h3 className="text-2xl font-bold text-gray-800">{selectedCustomer.customerName}</h3>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                        ID: {selectedCustomer._id}
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-gray-700 rounded-lg hover:bg-orange-50 transition-all"
                    >
                      ← Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                  {/* Basic Information */}
                  <div className="bg-white/80 col-span-2  backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="text-orange-600" size={24} />
                      <h4 className="text-xl font-semibold text-gray-800">Customer Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Customer Name</label>
                        <p className="text-gray-900 font-medium">{selectedCustomer.customerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                        <p className="text-gray-900">{selectedCustomer.status === "active" ? "Active" : "Inactive"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">DOB</label>
                        <p className="text-gray-900">{new Date(selectedCustomer.dob).toLocaleDateString("en-GB")}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Contact Number</label>
                        <p className="text-gray-900">+91-{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                        <p className="text-gray-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Geo-Location</label>
                        <p className="text-gray-900">{selectedCustomer.address[0].geoLocation.lat.toFixed(6)}, {selectedCustomer.address[0].geoLocation.lng.toFixed(6)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                        <p className="text-gray-900">{selectedCustomer.address[0].street}, {selectedCustomer.address[0].city}, {selectedCustomer.address[0].state}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
                        <p className="text-gray-700">{selectedCustomer.gender === "male" ? "Male" : "Female "}</p>
                      </div>
                    </div>
                    </div>
                    {/* Customer Orders */}
                    {selectedCustomer.orders &&
                      <div className="bg-white/80 backdrop-blur-sm p-6 flex flex-col rounded-2xl shadow-lg border border-orange-100/50">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Orders</h4>
                        {selectedCustomer.orders.length > 0  ? (
                          <div className="space-y-3">
                            {selectedCustomer.orders.map((order, idx) => (
                              <div
                                key={order._id || idx}
                                className="flex items-center justify-between border-b border-orange-100/50 pb-2 last:border-none"
                              >
                                {/* Left: Order ID */}
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Order ID: {order._id}</p>
                                  <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                                </div>
                              
                                {/* Right: Amount */}
                                <p className="text-sm font-semibold text-green-600">
                                  ₹{order.finalAmount?.toLocaleString() || 0}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-center items-center h-full font-medium p-6 box-border rounded-2xl text-center text-gray-500">
                            No orders for now.
                          </div>
                        )}
                      </div>
                    }
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                  {allCustomers.length > 0 ? (
                    <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Contact</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Location</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Orders</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Total Spent</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Join Date</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Status</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData().map((customer, idx) => (
                        <tr key={customer._id} onClick={() => setSelectedCustomer(customer)} className="border-t border-orange-100/50 hover:bg-orange-50/30 cursor-pointer transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {customer.customerName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <p className="font-medium text-gray-900">{customer.customerName}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1 mb-1">
                                <Mail size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-900">{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-500">+91-{customer.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-1">
                              <MapPin size={14} className="text-gray-400" />
                              <span className="text-gray-900">{customer.address[0].city}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="font-medium text-gray-900">{customer.orders.length || 0}</span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="font-medium text-green-600">{customer.spent || 0}</span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="text-gray-500">{(() => {
                                                  const date = new Date(customer.createdAt);
                                                  const day = String(date.getDate()).padStart(2, "0");
                                                  const month = String(date.getMonth() + 1).padStart(2, "0");
                                                  const year = date.getFullYear();
                                                  return `${day}-${month}-${year}`;
                                                })()}</span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={getStatusBadge(customer.status)}>
                              {customer.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 hover:bg-orange-50 rounded-lg text-orange-600 transition-colors">
                                <MessageSquare size={16} />
                              </button>
                              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    ) : (
                        <div className="text-center py-20 text-gray-500 font-medium text-lg">
                          No Customers are registered on the website for now.
                        </div>
                  )}
                </div>
              </div>)}
            </div>
          )}

          {/* Orders Management */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Clock className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                      <p className="text-sm text-gray-600">Active Orders</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
                      <p className="text-sm text-gray-600">Completed Today</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Pause className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <XCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-sm text-gray-600">Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-80 pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <select className="px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>On Way</option>
                    <option>Delivered</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-3 bg-white border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition-all">
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 bg-white border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition-all">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Restaurant</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData().map((order, idx) => (
                        <tr key={idx} className="border-t border-orange-100/50 hover:bg-orange-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{order.id}</span>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-900">{order.customer}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-gray-900">{order.restaurant}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-green-600">{order.amount}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={getStatusBadge(order.status)}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-500">{order.time}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 hover:bg-orange-50 rounded-lg text-orange-600 transition-colors">
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue Analytics</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 size={48} className="mx-auto mb-2 text-orange-400" />
                      <p>Revenue chart would be displayed here</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Distribution</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <PieChart size={48} className="mx-auto mb-2 text-orange-400" />
                      <p>Order distribution chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-orange-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Payment Management</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">₹1,24,560</p>
                    <p className="text-sm text-gray-600">Total Processed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <p className="text-2xl font-bold text-yellow-600">₹12,450</p>
                    <p className="text-sm text-gray-600">Pending Settlements</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <p className="text-2xl font-bold text-red-600">₹2,340</p>
                    <p className="text-sm text-gray-600">Failed Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="text-orange-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-800">General Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input type="text" value="FoodHub Admin" className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input type="email" value="support@foodhub.com" className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-100/50">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-orange-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-800">Security Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Two-Factor Authentication</span>
                      <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Enabled</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Session Timeout</span>
                      <select className="border border-orange-200 rounded px-3 py-1">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Sections Placeholder */}
          {["delivery", "reviews", "promotions"].includes(activeTab) && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-100/50 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {activeTab === "delivery" && <Truck className="text-white" size={32} />}
                {activeTab === "reviews" && <MessageSquare className="text-white" size={32} />}
                {activeTab === "promotions" && <Award className="text-white" size={32} />}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "delivery" && "Manage delivery partners, zones, and logistics"}
                {activeTab === "reviews" && "Monitor customer reviews and restaurant ratings"}
                {activeTab === "promotions" && "Create and manage promotional campaigns"}
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg">
                Coming Soon
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;