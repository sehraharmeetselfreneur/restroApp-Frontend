import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  Filter,
  Search,
  Leaf,
  Flame,
  Award,
  Timer,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  Zap,
  Check,
  X,
  Camera,
  TrendingUp,
  Percent,
  Navigation,
  ChefHat,
  Utensils,
  Coffee,
  IceCream,
  Soup,
  Salad,
  BadgeCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getParticularRestaurant } from '../api/homeApi';
import useAuthStore from '../store/useAuthStore';
import { addToCartApi, removeFromCartApi } from '../api/cartApi';
import { getCustomerProfile, updateFavourites } from '../api/customerApi';
import CartButton from '../components/home/CartButton';

const RestaurantMenuPage = () => {
    const { id } = useParams();
    const { user, setUser } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [restaurants, setRestaurant] = useState({});
    let favourites = user?.favourites?.favourites || [];

    const getRestaurantMutation = useMutation({
        mutationFn: getParticularRestaurant,
        onSuccess: (data) => {
            setRestaurant(data.data);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });
    const addToCartMutation = useMutation({
        mutationFn: addToCartApi,
        onSuccess: async (data) => {
            setUser(await getCustomerProfile(), "Customer");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });
    const removeFromCartMutation = useMutation({
        mutationFn: removeFromCartApi,
        onSuccess: async (data) => {
            setUser(await getCustomerProfile(), "Customer");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });
    const updateFavouriteMutation = useMutation({
        mutationFn: updateFavourites,
        onSuccess: async (data) => {
            toast.success(data.message);
            setUser(await getCustomerProfile(), "Customer");
            queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const [activeCategory, setActiveCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        veg: false,
        nonVeg: false,
        available: true,
        spicy: false,
        bestseller: false
    });
    const [cart, setCart] = useState({
        itemId: '',
        variantId: '',
        quantity: 1
    });
    const [showFilters, setShowFilters] = useState(false);
    const isFavorite = favourites?.some((restaurant) => restaurant._id?.toString() === restaurants._id?.toString());
    const [selectedItem, setSelectedItem] = useState(null);
    const [showItemModal, setShowItemModal] = useState(false);

    const categoryRefs = useRef({});

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Category icons mapping
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Starters': Utensils,
            'Main Course': ChefHat,
            'Desserts': IceCream,
            'Beverages': Coffee,
            'Snacks': Utensils,
            'Salads': Salad,
            'Soups': Soup,
            'Breakfast': Coffee,
            'Sides': Utensils,
            'Others': ChefHat
        };
        return iconMap[categoryName] || ChefHat;
    };

    const addToCart = (itemId, variantId = null) => {
        if(user){
            const payload = {
                itemId,
                variantId,
                quantity: 1
            }
            console.log(payload);
            addToCartMutation.mutate(payload);
        }
        else{
            navigate("/customer/login");
        }
    };

    const removeFromCart = (itemId, variantId = null) => {
        removeFromCartMutation.mutate(itemId, variantId);
    };

    const getCartQuantity = (itemId, variantId = null) => {
        if (!user?.cart?.items) return 0;

        return user.cart.items
            .filter((cartItem) => {
                const sameFood = cartItem.foodItemId._id.toString() === itemId;

                let sameVariant = false;
                if (!variantId && !cartItem.variantId) {
                    // Both have no variant
                    sameVariant = true;
                } else if (variantId && cartItem.variantId) {
                    // Both have variants
                    sameVariant =
                        cartItem.variantId.toString() ===
                        (typeof variantId === "string" ? variantId : variantId._id.toString());
                }

                return sameFood && sameVariant;
            })
            .reduce((total, item) => total + item.quantity, 0);
    };

    const scrollToCategory = (categoryId) => {
        setActiveCategory(categoryId);
        categoryRefs.current[categoryId]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
    };

    // Filter items based on search and filters
    const filteredCategories = restaurants.menu?.map(category => ({
        ...category,
        items: category.items?.filter(item => {
            const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesVeg = !selectedFilters.veg || item?.isVeg;
            const matchesNonVeg = !selectedFilters.nonVeg || !item?.isVeg;
            const matchesAvailable = !selectedFilters.available || item?.isAvailable;
            const matchesSpicy = !selectedFilters.spicy || item?.tags.includes('spicy');
            const matchesBestseller = !selectedFilters.bestseller || item?.tags.includes('bestseller');
            
            return matchesSearch && matchesVeg && matchesNonVeg && matchesAvailable && matchesSpicy && matchesBestseller;
        })
    })).filter(category => category.items?.length > 0);

    const handleUpdateFavourites = (id) => {
        updateFavouriteMutation.mutate(id);
    }

    useEffect(() => {
        getRestaurantMutation.mutate({ id, user });
    }, []);

    useEffect(() => {
        favourites = user?.favourites?.favourites;
        console.log(favourites);
    }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      {/* Restaurant Hero Section */}
      <div className="relative">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={import.meta.env.VITE_BACKEND_URL + restaurants.bannerImage} 
            alt={restaurants.restaurantName}
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Floating Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button 
              onClick={() => handleUpdateFavourites(restaurants._id)}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
            >
              <Heart className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'} transition-colors duration-300`} />
            </button>
            <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
              <Camera className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurants.isPromoted && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        PROMOTED
                      </span>
                    )}
                    {restaurants.isTrending && (
                      <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        TRENDING
                      </span>
                    )}
                    {restaurants.fastDelivery && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        FAST DELIVERY
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl flex items-center justify-start gap-3 font-bold text-white mb-2">
                    {restaurants.restaurantName}
                    {restaurants.isVerified && (
                      <h1 className="bg-green-500 text-white text-xs p-1.5 mt-1 rounded-full font-bold shadow-lg">
                        <BadgeCheck className="h-7 w-7" />
                      </h1>
                    )}
                  </h1>
                  <p className="text-xl text-white/90 mb-4 max-w-3xl">{restaurants.description}</p>
                  
                  <div className="flex flex-wrap gap-6 text-white/90">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{restaurants.rating}</span>
                      <span>({restaurants.reviews?.length} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5" />
                      <span>{restaurants.avgPrepTime || "40-45Mins"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-5 w-5" />
                      <span>{restaurants.distance?.toFixed(1) + " Km"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>{restaurants.openingTime} - {restaurants.closingTime}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:text-right">
                  <div className="flex flex-wrap lg:justify-end gap-2 mb-4">
                    {restaurants.cuisines?.map(cuisine => (
                      <span key={cuisine} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-semibold text-sm ${
                    restaurants.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${restaurants.isOpen ? 'bg-white' : 'bg-white'}`}></div>
                    <span>{restaurants.isOpen ? 'OPEN NOW' : 'CLOSED'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Banner */}
        {restaurants.offers?.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-8 animate-slide">
                <Percent className="h-5 w-5 flex-shrink-0" />
                <div className="flex space-x-8">
                  {restaurants.offers.map((offer, index) => (
                    <span key={index} className="font-semibold whitespace-nowrap">
                      🎉 {offer.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories & Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search food items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Filters</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {[
                    { key: 'veg', label: 'Vegetarian', icon: Leaf, color: 'text-green-600' },
                    { key: 'nonVeg', label: 'Non-Vegetarian', icon: Flame, color: 'text-red-600' },
                    { key: 'available', label: 'Available Only', icon: Check, color: 'text-blue-600' },
                    { key: 'spicy', label: 'Spicy', icon: Flame, color: 'text-orange-600' },
                    { key: 'bestseller', label: 'Bestseller', icon: Award, color: 'text-yellow-600' }
                  ].map(filter => (
                    <label key={filter.key} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFilters[filter.key]}
                        onChange={(e) => setSelectedFilters(prev => ({
                          ...prev,
                          [filter.key]: e.target.checked
                        }))}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <filter.icon className={`h-4 w-4 ${filter.color} group-hover:scale-110 transition-transform duration-300`} />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        {filter.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories Navigation */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  {filteredCategories?.map(category => {
                    const IconComponent = getCategoryIcon(category?.name);
                    return (
                      <button
                        key={category?._id}
                        onClick={() => scrollToCategory(category?._id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
                          activeCategory === category?._id
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                        }`}
                      >
                        <IconComponent className={`h-5 w-5 ${
                          activeCategory === category?._id ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'
                        } transition-colors duration-300`} />
                        <span className="flex-1 text-left">{category?.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activeCategory === category?._id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {category?.items?.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Menu Items */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
              {filteredCategories?.map(category => {
                const IconComponent = getCategoryIcon(category?.name);
                return (
                  <div 
                    key={category?._id} 
                    ref={el => categoryRefs.current[category?._id] = el}
                    className="scroll-mt-6"
                  >
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">{category?.name}</h2>
                        {category?.description && (
                          <p className="text-gray-600 mt-1 w-2xl">{category?.description}</p>
                        )}
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {category?.items?.length} items
                      </span>
                    </div>

                    <div className="grid gap-6">
                      {category?.items?.map(item => (
                        <div 
                          key={item?._id}
                          className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group"
                        >
                          <div className="grid md:grid-cols-3 gap-6 p-6">
                            <div className="md:col-span-2 space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className={`w-4 h-4 border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                                      {item.name}
                                    </h3>
                                    {item.tags.includes('bestseller') && (
                                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                                        <Award className="h-3 w-3 inline mr-1" />
                                        BESTSELLER
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                                  
                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {item.tags.map(tag => (
                                      <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
                                        {tag === 'spicy' && <Flame className="h-3 w-3 inline mr-1 text-orange-500" />}
                                        {tag === 'bestseller' && <Award className="h-3 w-3 inline mr-1 text-yellow-500" />}
                                        {tag}
                                      </span>
                                    ))}
                                  </div>

                                  {/* Price and Discount */}
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                      {item.discount_price ? (
                                        <>
                                          <span className="text-2xl font-bold text-gray-800">₹{item.discount_price}</span>
                                          <span className="text-lg text-gray-500 line-through">₹{item.price}</span>
                                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold">
                                            {Math.round(((item.price - item.discount_price) / item.price) * 100)}% OFF
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-2xl font-bold text-gray-800">₹{item.price}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <Timer className="h-4 w-4" />
                                      <span>{item.preparationTime} mins</span>
                                    </div>
                                  </div>

                                  {/* Variants */}
                                  {item?.variants && item?.variants?.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Choose Size:</h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {item?.variants.map(variant => (
                                          <div key={variant?.name} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-300 group/variant">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="font-semibold text-gray-800">{variant?.name}</span>
                                              <span className="font-bold text-orange-600">₹{variant?.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                              <span>{variant?.quantity}</span>
                                              <span>{variant?.calories} cal</span>
                                            </div>
                                            
                                            {/* Variant Add to Cart */}
                                            <div className="mt-3">
                                              {getCartQuantity(item._id, variant) === 0 ? (
                                                <button 
                                                  onClick={() => addToCart(item?._id, variant?._id)}
                                                  disabled={!item.isAvailable || !variant.isAvailable}
                                                  className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group-hover/variant:scale-105"
                                                >
                                                  Add to Cart
                                                </button>
                                              ) : (
                                                <div className="flex items-center justify-center space-x-3">
                                                  <button 
                                                    onClick={() => removeFromCart(item._id, variant._id)}
                                                    className="w-8 h-8 cursor-pointer bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                                                  >
                                                    <Minus className="h-4 w-4" />
                                                  </button>
                                                  <span className="font-bold text-lg min-w-[2rem] text-center">
                                                    {getCartQuantity(item._id, variant)}
                                                  </span>
                                                  <button 
                                                    onClick={() => addToCart(item._id, variant._id)}
                                                    className="w-8 h-8 cursor-pointer bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                                                  >
                                                    <Plus className="h-4 w-4" />
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Default Add to Cart (if no variants) */}
                                  {(!item.variants || item.variants.length === 0) && (
                                    <div className="flex items-center space-x-4">
                                      {getCartQuantity(item._id) === 0 ? (
                                        <button 
                                          onClick={() => addToCart(item._id)}
                                          disabled={!item.isAvailable}
                                          className="bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                          <ShoppingCart className="h-4 w-4" />
                                          <span>Add to Cart</span>
                                        </button>
                                      ) : (
                                        <div className="flex items-center space-x-2">
                                          <button 
                                            onClick={() => removeFromCart(item._id)}
                                            className="w-10 h-10 cursor-pointer bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                                          >
                                            <Minus className="h-5 w-5" />
                                          </button>
                                          <span className="font-bold text-xl min-w-[3rem] text-center">
                                            {getCartQuantity(item._id)}
                                          </span>
                                          <button 
                                            onClick={() => addToCart(item._id)}
                                            className="w-10 h-10 cursor-pointer bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                                          >
                                            <Plus className="h-5 w-5" />
                                          </button>
                                        </div>
                                      )}
                                      
                                      <button 
                                        onClick={() => {
                                          setSelectedItem(item);
                                          setShowItemModal(true);
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                                      >
                                        <Eye className="h-4 w-4" />
                                        <span>View Details</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Item Image */}
                            <div className="md:col-span-1">
                              <div className="relative overflow-hidden rounded-2xl h-48 md:h-full group/image">
                                {item.images && item.images.length > 0 ? (
                                  <img 
                                    src={import.meta.env.VITE_BACKEND_URL + item.images[0]} 
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <ChefHat className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                                
                                {/* Image Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                
                                {/* Availability Status */}
                                {!item.isAvailable && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                                      Currently Unavailable
                                    </span>
                                  </div>
                                )}
                                
                                {/* Quick View Button */}
                                <button 
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowItemModal(true);
                                  }}
                                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300"
                                >
                                  <Eye className="h-4 w-4 text-gray-700" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartButton />

      {/* Item Details Modal */}
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl no-scrollbar max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Modal Header with Image */}
              <div className="relative h-72 overflow-hidden rounded-t-3xl">
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <img 
                    src={import.meta.env.VITE_BACKEND_URL + selectedItem.images[0]} 
                    alt={selectedItem.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <button
                  onClick={() => setShowItemModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-5 h-5 border-2 ${selectedItem.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                    <div className={`w-3 h-3 rounded-full ${selectedItem.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">{selectedItem.name}</h2>
                  {selectedItem.tags.includes('bestseller') && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      <Award className="h-4 w-4 inline mr-1" />
                      BESTSELLER
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{selectedItem.description}</p>

                {/* Price and Info */}
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Price & Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        {selectedItem.discount_price ? (
                          <>
                            <span className="text-2xl font-bold text-gray-800">₹{selectedItem.discount_price}</span>
                            <span className="text-lg text-gray-500 line-through">₹{selectedItem.price}</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold">
                              {Math.round(((selectedItem.price - selectedItem.discount_price) / selectedItem.price) * 100)}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-800">₹{selectedItem.price}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Timer className="h-4 w-4" />
                        <span>Preparation time: {selectedItem.preparationTime} mins</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center space-x-1">
                          {tag === 'spicy' && <Flame className="h-3 w-3 text-orange-500" />}
                          {tag === 'bestseller' && <Award className="h-3 w-3 text-yellow-500" />}
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Variants */}
                {selectedItem.variants && selectedItem.variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Available Sizes</h3>
                    <div className="space-y-3">
                      {selectedItem.variants.map(variant => (
                        <div key={variant.name} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-semibold text-gray-800">{variant.name}</span>
                              <span className="text-gray-600 ml-2">({variant.quantity})</span>
                            </div>
                            <span className="font-bold text-orange-600">₹{variant.price}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{variant.calories} calories</span>
                            {getCartQuantity(selectedItem._id, variant) === 0 ? (
                              <button 
                                onClick={() => addToCart(selectedItem._id, variant)}
                                disabled={!selectedItem.isAvailable || !variant.isAvailable}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <button 
                                  onClick={() => removeFromCart(selectedItem._id, variant)}
                                  className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-bold text-lg min-w-[2rem] text-center">
                                  {getCartQuantity(selectedItem._id, variant)}
                                </span>
                                <button 
                                  onClick={() => addToCart(selectedItem._id, variant)}
                                  className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {(!selectedItem.variants || selectedItem.variants.length === 0) && (
                    <>
                      {getCartQuantity(selectedItem._id) === 0 ? (
                        <button 
                          onClick={() => addToCart(selectedItem._id)}
                          disabled={!selectedItem.isAvailable}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center space-x-4">
                          <button 
                            onClick={() => removeFromCart(selectedItem._id)}
                            className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                          >
                            <Minus className="h-6 w-6" />
                          </button>
                          <span className="font-bold text-2xl min-w-[3rem] text-center">
                            {getCartQuantity(selectedItem._id)}
                          </span>
                          <button 
                            onClick={() => addToCart(selectedItem._id)}
                            className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                          >
                            <Plus className="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  <button 
                    onClick={() => setShowItemModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenuPage;