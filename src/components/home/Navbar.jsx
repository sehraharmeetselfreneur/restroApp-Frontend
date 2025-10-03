import { useState, useRef, useEffect } from 'react'
import { 
    ArrowRight, 
    ChevronDown, 
    MapPin, 
    Menu, 
    Pizza, 
    ShoppingCart, 
    User, 
    X,
    LogOut,
    Settings,
    Heart,
    Clock,
    HelpCircle,
    Gift,
    Bell,
    Search,
    Star,
    Wallet
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from "../../store/useAuthStore";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutCustomer } from '../../api/customerApi';
import toast from 'react-hot-toast';

const Navbar = ({ location = "Faridabad, Haryana" }) => {
    const queryClient = useQueryClient();
    const { user, clearUser } = useAuthStore();
    const routerLocation = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications] = useState(3); // Mock notification count

    const profileRef = useRef(null);
    const locationRef = useRef(null);
    const totalItems = user?.cart?.items?.reduce((sum, item) => sum+=item.quantity, 0);

    const customerLogoutMutation = useMutation({
        mutationFn: logoutCustomer,
        onSuccess: (data) => {
            toast.success(data.message);
            clearUser();
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
        },
        onError: (data) => {
            toast.error(data.response.data?.message);
        }
    })

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setIsLocationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Home', url: '/', icon: null },
        { name: 'Restaurants', url: '/restaurants', icon: null },
        { name: 'Offers', url: '/offers', icon: Gift },
        { name: 'Premium', url: '/premium', icon: Star },
        { name: 'Help', url: '/help', icon: HelpCircle }
    ];

    const profileMenuItems = [
        { name: 'My Profile', icon: User, url: '/profile' },
        { name: 'My Orders', icon: Clock, url: '/orders' },
        { name: 'Favorites', icon: Heart, url: '/favorites' },
        { name: 'Wallet', icon: Wallet, url: '/wallet' },
        { name: 'Settings', icon: Settings, url: '/settings' },
        { name: 'Help & Support', icon: HelpCircle, url: '/support' }
    ];

    const isActiveRoute = (path) => {
        return routerLocation.pathname === path;
    };

    const handleLogout = () => {
        customerLogoutMutation.mutate();
        setIsProfileOpen(false);
    };

    return (
        <>
            <header className="bg-white/95 backdrop-blur-md h-20 shadow-lg w-full fixed top-0 z-50 transition-all duration-300 border-b border-gray-100">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-2">
                    <div className="flex items-center justify-between gap-4 h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <Pizza className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    FlavorForge
                                </span>
                                <div className="text-xs text-gray-500 -mt-1">Premium Food Delivery</div>
                            </div>
                        </Link>

                        {/* Search Bar - Hidden on mobile, visible on larger screens */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for restaurants, food..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-700 placeholder-gray-500 focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden lg:flex items-center space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.url}
                                    to={item.url}
                                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-full font-medium group transition-all duration-300 hover:scale-105 ${
                                        isActiveRoute(item.url)
                                            ? "text-orange-600"
                                            : "text-gray-700 hover:text-orange-500"
                                    }`}
                                >
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    <span>{item.name}</span>
                                    {/* Active indicator */}
                                    <span
                                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-orange-500 group-hover:opacity-100 rounded-full transition-all duration-300 ${
                                            isActiveRoute(item.url) ? "opacity-100" : "opacity-0"
                                        }`}
                                    ></span>
                                </Link>
                            ))}
                        </nav>
                        
                        {/* Right Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Location Selector */}
                            <div className="hidden md:block relative" ref={locationRef}>
                                <button
                                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-2 cursor-pointer transition-all duration-300 border border-gray-200 hover:border-gray-300"
                                >
                                    <MapPin className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                                        {location.split(',')[0]}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isLocationOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Location Dropdown */}
                                {isLocationOpen && (
                                    <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-64 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <h3 className="text-sm font-semibold text-gray-800">Select Location</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {['Faridabad, Haryana', 'Delhi, India', 'Gurgaon, Haryana', 'Noida, UP'].map((loc) => (
                                                <button
                                                    key={loc}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-orange-600"
                                                    onClick={() => {
                                                        setIsLocationOpen(false);
                                                        // Handle location change
                                                    }}
                                                >
                                                    <MapPin className="h-4 w-4 inline mr-2 text-gray-400" />
                                                    {loc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Conditional rendering based on authentication */}
                            {user ? (
                                <>
                                    {/* Track Order Button */}
                                    <Link
                                        to="/track-order"
                                        className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-orange-500 font-medium transition-all hover:scale-105 rounded-full hover:bg-gray-50"
                                    >
                                        <Clock className="h-4 w-4" />
                                        <span>Track Order</span>
                                    </Link>

                                    {/* Notifications */}
                                    <div className="relative">
                                        <button className="p-2.5 cursor-pointer rounded-full bg-gray-50 hover:bg-gray-100 transition-all hover:scale-105 border border-gray-200">
                                            <Bell className="h-5 w-5 text-gray-600" />
                                        </button>
                                        {notifications > 0 && (
                                            <span className="absolute -top-1 -right-1 cursor-pointer bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                                {notifications}
                                            </span>
                                        )}
                                    </div>

                                    {/* Shopping Cart */}
                                    <Link to="/cart" className="relative group">
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110">
                                            <ShoppingCart className="h-5 w-5 text-white" />
                                        </div>
                                        {user.cart?.items?.length > 0 &&
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                                {totalItems}
                                            </span>
                                        }
                                    </Link>

                                    {/* Profile Dropdown */}
                                    <div className="relative" ref={profileRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center cursor-pointer space-x-2 p-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 border-2 border-orange-200 hover:border-orange-400"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-400 flex items-center justify-center shadow-md">
                                                {user ? (
                                                    <img
                                                        src={import.meta.env.VITE_BACKEND_URL + user.profile.profileImage}
                                                        alt={user.name}
                                                        className="w-full h-full rounded-full object-cover border border-orange-400"
                                                    />
                                                ) : (
                                                    <span className="text-white font-semibold text-sm">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronDown className={`h-4 w-4  transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Profile Dropdown Menu */}
                                        {isProfileOpen && (
                                            <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-64 z-50">
                                                {/* User Info */}
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-400 flex items-center justify-center shadow-md">
                                                            {user ? (
                                                                <img
                                                                    src={import.meta.env.VITE_BACKEND_URL + user.profile.profileImage}
                                                                    alt={user.name}
                                                                    className="w-full h-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-white font-semibold">
                                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">{user.profile.customerName || 'User'}</h3>
                                                            <p className="text-sm text-gray-600">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="py-1">
                                                    {profileMenuItems.map((item) => (
                                                        <Link
                                                            key={item.url}
                                                            to={item.url}
                                                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-orange-600"
                                                            onClick={() => setIsProfileOpen(false)}
                                                        >
                                                            <item.icon className="h-4 w-4" />
                                                            <span className="text-sm">{item.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Logout */}
                                                <div className="border-t border-gray-100 py-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex cursor-pointer items-center space-x-3 w-full px-4 py-3 hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        <span className="text-sm">Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Login Button */}
                                    <Link
                                        to="/customer/login"
                                        className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-orange-500 transition-all hover:scale-105 rounded-full hover:bg-gray-50 font-medium"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Login</span>
                                    </Link>

                                    {/* Get Started Button */}
                                    <Link
                                        to="/customer/signup"
                                        className="flex items-center space-x-2 group bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105 shadow-md"
                                    >
                                        <span className="hidden sm:block">Get Started</span>
                                        <span className="sm:hidden">Join</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                </>
                            )}
                            
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                        <div className="px-4 py-4 space-y-3">
                            {/* Mobile Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search restaurants, food..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Mobile Navigation */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.url}
                                    to={item.url}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                        isActiveRoute(item.url)
                                            ? "text-orange-600 bg-orange-50"
                                            : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon && <item.icon className="h-5 w-5" />}
                                    <span>{item.name}</span>
                                </Link>
                            ))}

                            {/* Mobile Location */}
                            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                                <MapPin className="h-5 w-5 text-orange-500" />
                                <span className="text-gray-700 font-medium">{location}</span>
                            </div>

                            {/* Mobile Auth Buttons */}
                            {!user && (
                                <div className="pt-4 space-y-3 border-t border-gray-200">
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium transition-all shadow-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Profile Menu for logged in users */}
                            {user && (
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-white font-semibold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{user.name || 'User'}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    {profileMenuItems.map((item) => (
                                        <Link
                                            key={item.url}
                                            to={item.url}
                                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                    
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-red-600 mt-2"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
            {/* Spacer to prevent content from hiding under fixed navbar */}
            <div className="h-20"></div>
        </>
    );
};

export default Navbar;