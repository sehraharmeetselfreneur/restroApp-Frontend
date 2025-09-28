import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Settings,
  Heart,
  Clock,
  Star,
  Award,
  TrendingUp,
  Wallet,
  CreditCard,
  Gift,
  Bell,
  Shield,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Camera,
  Upload,
  Check,
  ChevronRight,
  Package,
  Timer,
  Percent,
  Crown,
  Zap,
  Target,
  Navigation,
  Home,
  Building,
  Coffee
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const CustomerProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'home', address: '', landmark: '' });

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c9?w=150&h=150&fit=crop&crop=face',
    joinDate: 'Member since Jan 2023',
    totalOrders: 247,
    totalSpent: 45680,
    favoriteRestaurants: 23,
    reviewsGiven: 89,
    loyaltyPoints: 2450,
    currentTier: 'Gold',
    addresses: [
      { id: 1, type: 'home', address: 'Flat 201, Sunrise Apartments, Sector 15, Faridabad', landmark: 'Near Metro Station', isDefault: true },
      { id: 2, type: 'work', address: 'Tower A, Cyber City, Gurgaon, Haryana', landmark: 'DLF Phase 2', isDefault: false },
      { id: 3, type: 'other', address: 'House 45, Green Park Extension, Delhi', landmark: 'Near Green Park Metro', isDefault: false }
    ]
  });

  const recentOrders = [
    {
      id: 'ORD001',
      restaurant: 'The Spice Route',
      items: 'Chicken Biryani, Raita, Dessert',
      date: '2 hours ago',
      amount: 649,
      status: 'delivered',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop'
    },
    {
      id: 'ORD002',
      restaurant: 'Pizza Palace',
      items: 'Margherita Pizza, Garlic Bread',
      date: '1 day ago',
      amount: 899,
      status: 'delivered',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&fit=crop'
    },
    {
      id: 'ORD003',
      restaurant: 'Burger Junction',
      items: 'Classic Burger, Fries, Coke',
      date: '3 days ago',
      amount: 456,
      status: 'delivered',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=80&h=80&fit=crop'
    }
  ];

  const favoriteRestaurants = [
    { id: 1, name: 'The Spice Route', cuisine: 'North Indian', rating: 4.5, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop' },
    { id: 2, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.7, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop' },
    { id: 3, name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.6, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop' },
    { id: 4, name: 'Taco Fiesta', cuisine: 'Mexican', rating: 4.4, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=100&h=100&fit=crop' }
  ];

  const achievements = [
    { icon: Award, title: 'Foodie Explorer', description: 'Ordered from 50+ restaurants', color: 'from-yellow-400 to-orange-500' },
    { icon: Crown, title: 'Gold Member', description: 'Reached Gold tier status', color: 'from-yellow-500 to-yellow-600' },
    { icon: Star, title: 'Top Reviewer', description: 'Written 50+ helpful reviews', color: 'from-blue-400 to-purple-500' },
    { icon: Zap, title: 'Speed Orderer', description: 'Completed 100+ orders', color: 'from-green-400 to-emerald-500' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile logic here
  };

  const handleAddAddress = () => {
    if (newAddress.address.trim()) {
      const address = {
        id: Date.now(),
        ...newAddress,
        isDefault: userData.addresses.length === 0
      };
      setUserData(prev => ({
        ...prev,
        addresses: [...prev.addresses, address]
      }));
      setNewAddress({ type: 'home', address: '', landmark: '' });
      setShowAddressModal(false);
    }
  };

  const handleDeleteAddress = (id) => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Profile Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                  <img 
                    src={import.meta.env.VITE_BACKEND_URL + user.profile.profileImage} 
                    alt={userData.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 group-hover:bg-orange-100">
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{user.profile.customerName}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-white/90">
                    <Mail className="h-4 w-4" />
                    <span>{user.profile.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-white/90">
                    <Phone className="h-4 w-4" />
                    <span>+91 {user.profile.phone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-white/80 mb-6">
                  <Calendar className="h-4 w-4" />
                  <span>{user.profile.createdAt.split("T")[0]}</span>
                </div>
                
                {/* Tier Badge */}
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <span className="text-white font-semibold">{userData.currentTier} Member</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full lg:max-w-none">
              {[
                { label: 'Total Orders', value: user.profile.orders.length, icon: Package, color: 'from-blue-400 to-blue-600' },
                { label: 'Amount Spent', value: `₹${userData.totalSpent.toLocaleString()}`, icon: Wallet, color: 'from-green-400 to-green-600' },
                { label: 'Favorites', value: userData.favoriteRestaurants, icon: Heart, color: 'from-pink-400 to-pink-600' },
                { label: 'Reviews', value: userData.reviewsGiven, icon: Star, color: 'from-yellow-400 to-yellow-600' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Profile Menu</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'} transition-colors duration-300`} />
                    <span>{tab.label}</span>
                    {activeTab !== tab.id && <ChevronRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-orange-600 transition-colors duration-300" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 mt-10">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Account Overview</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Edit className="h-4 w-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  {/* Achievements */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Your Achievements</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-100">
                          <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <achievement.icon className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-800 mb-2">{achievement.title}</h4>
                          <p className="text-gray-600">{achievement.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                      {recentOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 group">
                          <img 
                            src={order.image} 
                            alt={order.restaurant}
                            className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{order.restaurant}</h4>
                            <p className="text-sm text-gray-600 mb-1">{order.items}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{order.date}</span>
                              <span>₹{order.amount}</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < order.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
                    <div className="flex space-x-3">
                      <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>All time</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <img 
                            src={order.image} 
                            alt={order.restaurant}
                            className="w-20 h-20 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{order.restaurant}</h3>
                                <p className="text-gray-600 mb-2">{order.items}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Timer className="h-4 w-4" />
                                    <span>{order.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Wallet className="h-4 w-4" />
                                    <span>₹{order.amount}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col lg:items-end gap-3">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < order.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    Reorder
                                  </button>
                                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Favorite Restaurants</h2>
                    <span className="text-sm text-gray-600">{favoriteRestaurants.length} restaurants</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {favoriteRestaurants.map((restaurant) => (
                      <div key={restaurant.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                          <img 
                            src={restaurant.image} 
                            alt={restaurant.name}
                            className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-semibold text-gray-700">{restaurant.rating}</span>
                            </div>
                          </div>
                          <button className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          Order Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {userData.addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              address.type === 'home' ? 'bg-blue-100' :
                              address.type === 'work' ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                              {address.type === 'home' ? <Home className="h-6 w-6 text-blue-600" /> :
                               address.type === 'work' ? <Building className="h-6 w-6 text-green-600" /> :
                               <MapPin className="h-6 w-6 text-purple-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-800 capitalize">{address.type}</h3>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-1">{address.address}</p>
                              <p className="text-sm text-gray-500">{address.landmark}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(address.id)}
                              className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Wallet & Rewards</h2>
                  
                  {/* Wallet Balance Card */}
                  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2">FlavorForge Wallet</h3>
                          <div className="text-3xl font-bold">₹2,450</div>
                          <p className="text-white/80">Available Balance</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-white/20 rounded-2xl px-4 py-2 mb-2">
                            <div className="text-2xl font-bold">{userData.loyaltyPoints}</div>
                            <div className="text-sm text-white/80">Reward Points</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                          Add Money
                        </button>
                        <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                          Transaction History
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid sm:grid-cols-3 gap-6 mb-8">
                    {[
                      { icon: Gift, title: 'Redeem Rewards', desc: 'Use your points', color: 'from-orange-400 to-red-500' },
                      { icon: Percent, title: 'Active Offers', desc: '3 offers available', color: 'from-green-400 to-emerald-500' },
                      { icon: Crown, title: 'Tier Benefits', desc: 'Gold member perks', color: 'from-yellow-400 to-orange-500' }
                    ].map((action, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Transactions */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h3>
                    <div className="space-y-4">
                      {[
                        { type: 'debit', desc: 'Payment for order #ORD001', amount: 649, date: '2 hours ago', icon: Package },
                        { type: 'credit', desc: 'Cashback from Pizza Palace', amount: 65, date: '1 day ago', icon: Gift },
                        { type: 'credit', desc: 'Referral bonus', amount: 100, date: '3 days ago', icon: Award },
                        { type: 'debit', desc: 'Payment for order #ORD002', amount: 899, date: '5 days ago', icon: Package }
                      ].map((transaction, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <transaction.icon className={`h-6 w-6 ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{transaction.desc}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                          <div className={`text-lg font-bold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h2>
                  
                  <div className="space-y-8">
                    {/* Profile Information */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={userData.name}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                            onChange={(e) => setUserData(prev => ({...prev, name: e.target.value}))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={userData.email}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                            onChange={(e) => setUserData(prev => ({...prev, email: e.target.value}))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={userData.phone}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                            onChange={(e) => setUserData(prev => ({...prev, phone: e.target.value}))}
                          />
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex space-x-4 mt-6">
                          <button
                            onClick={handleSaveProfile}
                            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6">Preferences</h3>
                      <div className="space-y-4">
                        {[
                          { title: 'Order Notifications', desc: 'Get updates about your orders', enabled: true },
                          { title: 'Promotional Offers', desc: 'Receive special deals and discounts', enabled: true },
                          { title: 'Restaurant Recommendations', desc: 'Get personalized food suggestions', enabled: false },
                          { title: 'SMS Alerts', desc: 'Receive SMS notifications', enabled: true }
                        ].map((pref, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                              <h4 className="font-semibold text-gray-800">{pref.title}</h4>
                              <p className="text-sm text-gray-600">{pref.desc}</p>
                            </div>
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                              pref.enabled ? 'bg-orange-500' : 'bg-gray-300'
                            }`}>
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  pref.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6">Security</h3>
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 group">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-800">Change Password</h4>
                              <p className="text-sm text-gray-600">Update your account password</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors duration-300" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 group">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                              <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-800">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-600">Add an extra layer of security</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Add New Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['home', 'work', 'other'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewAddress(prev => ({...prev, type}))}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                        newAddress.type === type
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {type === 'home' ? <Home className="h-6 w-6 mb-2" /> :
                       type === 'work' ? <Building className="h-6 w-6 mb-2" /> :
                       <MapPin className="h-6 w-6 mb-2" />}
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({...prev, address: e.target.value}))}
                  placeholder="Enter your complete address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress(prev => ({...prev, landmark: e.target.value}))}
                  placeholder="Nearby landmark"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddAddress}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Add Address
                </button>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfilePage;