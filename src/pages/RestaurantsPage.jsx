import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  Heart,
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  List,
  Award,
  Zap,
  Leaf,
  TrendingUp,
  Crown,
  Navigation,
  Phone,
  Mail,
  ArrowRight,
  X,
  Check,
  Calendar,
  Users,
  Percent,
  Timer,
  ChefHat,
  ShoppingCart,
  Eye,
  Share2,
  Bookmark
} from 'lucide-react';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import useAuthStore from '../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { getNearByRestaurants } from '../api/homeApi';
import { useNavigate } from 'react-router-dom';
import CartButton from '../components/home/CartButton';

const RestaurantsPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [allRestaurants, setAllRestaurants] = useState({});

  const getRestaurantsMutation = useMutation({
    mutationFn: getNearByRestaurants,
    onSuccess: (data) => {
        setAllRestaurants(data);
    },
    onError: (error) => {
        toast.error(error.response.data?.message);
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Faridabad, Haryana');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: [],
    rating: '',
    priceRange: '',
    features: [],
    deliveryTime: '',
    isOpen: false
  });
  const [favorites, setFavorites] = useState(new Set([1, 3, 7, 12]));
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 12;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock restaurants data based on your schema
  const restaurants = [
    {
      _id: '1',
      restaurantName: 'The Spice Route',
      ownerName: 'Rajesh Kumar',
      description: 'Authentic North Indian cuisine with traditional flavors and modern presentation.',
      bannerImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop',
      cuisines: ['North Indian', 'Mughlai', 'Biryani'],
      rating: 4.5,
      phone: '+91 98765 43210',
      email: 'spiceroute@gmail.com',
      address: {
        street: 'Sector 15, Main Market',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121007'
      },
      openingTime: '11:00',
      closingTime: '23:00',
      pureVeg: false,
      isOpen: true,
      isVerified: true,
      isTrending: true,
      isPromoted: true,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1563379091339-03246963d51d?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹',
      deliveryTime: '25-30 min',
      distance: '1.2 km',
      totalOrders: 2847,
      offers: ['50% OFF up to ₹100', 'Free Delivery']
    },
    {
      _id: '2',
      restaurantName: 'Pizza Palace',
      ownerName: 'Marco Rossi',
      description: 'Wood-fired authentic Italian pizzas with fresh ingredients and traditional recipes.',
      bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop',
      cuisines: ['Italian', 'Pizza', 'Continental'],
      rating: 4.7,
      phone: '+91 98765 43211',
      email: 'pizzapalace@gmail.com',
      address: {
        street: 'Sector 21, Crown Plaza',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121001'
      },
      openingTime: '12:00',
      closingTime: '24:00',
      pureVeg: true,
      isOpen: true,
      isVerified: true,
      isTrending: false,
      isPromoted: true,
      fastDelivery: false,
      images: [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹₹',
      deliveryTime: '30-35 min',
      distance: '2.1 km',
      totalOrders: 3241,
      offers: ['40% OFF + Free Delivery', 'Buy 1 Get 1 Free']
    },
    {
      _id: '3',
      restaurantName: 'Burger Junction',
      ownerName: 'Mike Johnson',
      description: 'Gourmet burgers made with premium ingredients and served with crispy fries.',
      bannerImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop',
      cuisines: ['American', 'Fast Food', 'Burgers'],
      rating: 4.3,
      phone: '+91 98765 43212',
      email: 'burgerjunction@gmail.com',
      address: {
        street: 'Sector 12, Food Court',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121003'
      },
      openingTime: '10:00',
      closingTime: '22:00',
      pureVeg: false,
      isOpen: true,
      isVerified: true,
      isTrending: true,
      isPromoted: false,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹',
      deliveryTime: '20-25 min',
      distance: '0.8 km',
      totalOrders: 1456,
      offers: ['₹125 OFF above ₹249']
    },
    {
      _id: '4',
      restaurantName: 'Sushi Zen',
      ownerName: 'Akiko Tanaka',
      description: 'Premium Japanese cuisine with fresh sashimi and authentic sushi preparations.',
      bannerImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop',
      cuisines: ['Japanese', 'Sushi', 'Asian'],
      rating: 4.6,
      phone: '+91 98765 43213',
      email: 'sushizen@gmail.com',
      address: {
        street: 'Sector 18, Omaxe Mall',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121002'
      },
      openingTime: '18:00',
      closingTime: '23:30',
      pureVeg: false,
      isOpen: true,
      isVerified: true,
      isTrending: false,
      isPromoted: false,
      fastDelivery: false,
      images: [
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹₹₹',
      deliveryTime: '40-45 min',
      distance: '3.5 km',
      totalOrders: 987,
      offers: ['Premium Exclusive Menu']
    },
    {
      _id: '5',
      restaurantName: 'Taco Fiesta',
      ownerName: 'Carlos Rodriguez',
      description: 'Vibrant Mexican flavors with authentic tacos, burritos and nachos.',
      bannerImage: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=300&fit=crop',
      cuisines: ['Mexican', 'Tex-Mex', 'Latin American'],
      rating: 4.4,
      phone: '+91 98765 43214',
      email: 'tacofiesta@gmail.com',
      address: {
        street: 'Sector 16, Central Market',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121008'
      },
      openingTime: '11:30',
      closingTime: '22:30',
      pureVeg: false,
      isOpen: true,
      isVerified: true,
      isTrending: true,
      isPromoted: false,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹',
      deliveryTime: '35-40 min',
      distance: '1.9 km',
      totalOrders: 1876,
      offers: ['Buy 2 Get 1 Free', '30% OFF on Combos']
    },
    {
      _id: '6',
      restaurantName: 'Green Bowl',
      ownerName: 'Priya Sharma',
      description: 'Healthy salads, smoothie bowls and organic meals for conscious eaters.',
      bannerImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=300&fit=crop',
      cuisines: ['Healthy', 'Salads', 'Organic'],
      rating: 4.2,
      phone: '+91 98765 43215',
      email: 'greenbowl@gmail.com',
      address: {
        street: 'Sector 14, Health Plaza',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121004'
      },
      openingTime: '08:00',
      closingTime: '21:00',
      pureVeg: true,
      isOpen: true,
      isVerified: true,
      isTrending: false,
      isPromoted: false,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹',
      deliveryTime: '25-30 min',
      distance: '1.7 km',
      totalOrders: 654,
      offers: ['30% OFF on Healthy Food']
    },
    {
      _id: '7',
      restaurantName: 'Biryani Express',
      ownerName: 'Ahmed Hassan',
      description: 'Authentic Hyderabadi biryani with aromatic basmati rice and tender meat.',
      bannerImage: 'https://images.unsplash.com/photo-1563379091339-03246963d51d?w=500&h=300&fit=crop',
      cuisines: ['Biryani', 'Hyderabadi', 'Mughlai'],
      rating: 4.8,
      phone: '+91 98765 43216',
      email: 'biryaniexpress@gmail.com',
      address: {
        street: 'Sector 19, Old City',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121009'
      },
      openingTime: '12:00',
      closingTime: '23:00',
      pureVeg: false,
      isOpen: true,
      isVerified: true,
      isTrending: true,
      isPromoted: true,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1563379091339-03246963d51d?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹',
      deliveryTime: '30-35 min',
      distance: '2.3 km',
      totalOrders: 4532,
      offers: ['Free Raita with Biryani', '20% OFF above ₹399']
    },
    {
      _id: '8',
      restaurantName: 'Dessert Dreams',
      ownerName: 'Sophie Laurent',
      description: 'Artisan desserts, ice creams and pastries crafted with love and premium ingredients.',
      bannerImage: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=300&fit=crop',
      cuisines: ['Desserts', 'Ice Cream', 'Bakery'],
      rating: 4.5,
      phone: '+91 98765 43217',
      email: 'dessertdreams@gmail.com',
      address: {
        street: 'Sector 11, Sweet Street',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121005'
      },
      openingTime: '10:00',
      closingTime: '22:30',
      pureVeg: true,
      isOpen: true,
      isVerified: true,
      isTrending: false,
      isPromoted: false,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹',
      deliveryTime: '20-25 min',
      distance: '1.4 km',
      totalOrders: 892,
      offers: ['25% OFF on Orders Above ₹199']
    },
    {
      _id: '9',
      restaurantName: 'Café Mocha',
      ownerName: 'David Brown',
      description: 'Premium coffee, artisan sandwiches and cozy atmosphere for coffee lovers.',
      bannerImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=300&fit=crop',
      cuisines: ['Coffee', 'Café', 'Snacks'],
      rating: 4.1,
      phone: '+91 98765 43218',
      email: 'cafemocha@gmail.com',
      address: {
        street: 'Sector 10, Coffee Lane',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121006'
      },
      openingTime: '07:00',
      closingTime: '23:00',
      pureVeg: true,
      isOpen: true,
      isVerified: true,
      isTrending: false,
      isPromoted: false,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹',
      deliveryTime: '15-20 min',
      distance: '0.9 km',
      totalOrders: 567,
      offers: ['Flat ₹50 OFF on Beverages']
    },
    {
      _id: '10',
      restaurantName: 'Thai Garden',
      ownerName: 'Siriporn Thani',
      description: 'Authentic Thai cuisine with traditional curries, noodles and aromatic herbs.',
      bannerImage: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=500&h=300&fit=crop',
      cuisines: ['Thai', 'Asian', 'Curry'],
      rating: 4.4,
      phone: '+91 98765 43219',
      email: 'thaigarden@gmail.com',
      address: {
        street: 'Sector 20, Asia Plaza',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121010'
      },
      openingTime: '12:00',
      closingTime: '22:00',
      pureVeg: false,
      isOpen: true,
      isVerified: true,
      isTrending: false,
      isPromoted: false,
      fastDelivery: false,
      images: [
        'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹₹',
      deliveryTime: '35-40 min',
      distance: '2.8 km',
      totalOrders: 1234,
      offers: ['Authentic Thai at 20% OFF']
    },
    {
      _id: '11',
      restaurantName: 'Street Food Hub',
      ownerName: 'Ramesh Gupta',
      description: 'Delicious Indian street food with authentic flavors and hygenic preparation.',
      bannerImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=300&fit=crop',
      cuisines: ['Street Food', 'Chaat', 'Indian'],
      rating: 4.3,
      phone: '+91 98765 43220',
      email: 'streetfoodhub@gmail.com',
      address: {
        street: 'Sector 13, Street Food Corner',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121011'
      },
      openingTime: '16:00',
      closingTime: '24:00',
      pureVeg: true,
      isOpen: true,
      isVerified: true,
      isTrending: true,
      isPromoted: false,
      fastDelivery: true,
      images: [
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop'
      ],
      priceRange: '₹',
      deliveryTime: '25-30 min',
      distance: '1.6 km',
      totalOrders: 2156,
      offers: ['Combo Deals Starting ₹99']
    },
    {
      _id: '12',
      restaurantName: 'Ocean Delights',
      ownerName: 'Captain Robert',
      description: 'Fresh seafood and continental dishes with ocean-to-table freshness.',
      bannerImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=300&fit=crop',
      cuisines: ['Seafood', 'Continental', 'Fish'],
      rating: 4.6,
      phone: '+91 98765 43221',
      email: 'oceandelights@gmail.com',
      address: {
        street: 'Sector 22, Marine Drive',
        city: 'Faridabad',
        state: 'Haryana',
        pincode: '121012'
      },
      openingTime: '18:00',
      closingTime: '23:30',
      pureVeg: false,
      isOpen: true,
      isVerified: true,
      isTrending: false,
      isPromoted: false,
      fastDelivery: false,
      images: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=200&fit=crop'
      ],
      priceRange: '₹₹₹',
      deliveryTime: '45-50 min',
      distance: '3.2 km',
      totalOrders: 1789,
      offers: ['Fresh Catch of the Day']
    }
  ];

  const cuisineTypes = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican', 'Japanese', 'Thai', 'Continental', 'Fast Food', 'Desserts', 'Beverages'];
  
  const filterFeatures = [
    { id: 'pureVeg', label: 'Pure Veg', icon: Leaf },
    { id: 'fastDelivery', label: 'Fast Delivery', icon: Zap },
    { id: 'isTrending', label: 'Trending', icon: TrendingUp },
    { id: 'isPromoted', label: 'Promoted', icon: Award },
    { id: 'isVerified', label: 'Verified', icon: Check }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Rating (High to Low)' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'distance', label: 'Distance' },
    { value: 'totalOrders', label: 'Most Popular' },
    { value: 'priceRange', label: 'Price (Low to High)' }
  ];

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => {
      if (category === 'cuisine') {
        const newCuisines = prev.cuisine.includes(value)
          ? prev.cuisine.filter(c => c !== value)
          : [...prev.cuisine, value];
        return { ...prev, cuisine: newCuisines };
      }
      if (category === 'features') {
        const newFeatures = prev.features.includes(value)
          ? prev.features.filter(f => f !== value)
          : [...prev.features, value];
        return { ...prev, features: newFeatures };
      }
      return { ...prev, [category]: prev[category] === value ? '' : value };
    });
  };

  // Filter and sort restaurants
  const filteredRestaurants = (allRestaurants?.restaurants || []).filter(restaurant => {
    const matchesSearch = restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisines.some(cuisine => cuisine.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCuisine = selectedFilters.cuisine.length === 0 || 
                          selectedFilters.cuisine.some(c => restaurant.cuisines.includes(c));
    
    const matchesRating = !selectedFilters.rating || restaurant.rating >= parseFloat(selectedFilters.rating);
    
    const matchesFeatures = selectedFilters.features.length === 0 || 
                           selectedFilters.features.every(feature => restaurant[feature]);
    
    const matchesOpen = !selectedFilters.isOpen || restaurant.isOpen;

    return matchesSearch && matchesCuisine && matchesRating && matchesFeatures && matchesOpen;
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants]?.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'deliveryTime':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'totalOrders':
        return b.totalOrders - a.totalOrders;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedRestaurants.length / restaurantsPerPage);
  const startIndex = (currentPage - 1) * restaurantsPerPage;
  const paginatedRestaurants = sortedRestaurants.slice(startIndex, startIndex + restaurantsPerPage);

  const clearAllFilters = () => {
    setSelectedFilters({
      cuisine: [],
      rating: '',
      priceRange: '',
      features: [],
      deliveryTime: '',
      isOpen: false
    });
    setSearchQuery('');
  };

  useEffect(() => {
    getRestaurantsMutation.mutate({ user, distance: 40000 });
  }, []);

  useEffect(() => {
    console.log(allRestaurants);
  }, [allRestaurants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Discover Amazing Restaurants
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Explore {allRestaurants?.restaurants?.length}+ restaurants in {user?.profile?.address[0]?.state} with diverse cuisines, 
              great offers, and lightning-fast delivery
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/55 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
              <div className="grid md:grid-cols-12 gap-4">
                <div className="md:col-span-9">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search restaurants, cuisines, dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all text-lg"
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <button className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Find Restaurants
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { label: 'Total Restaurants', value: allRestaurants?.restaurantCount, icon: ChefHat },
              { label: 'Active Offers', value: '150+', icon: Percent },
              { label: 'Happy Customers', value: '50K+', icon: Users },
              { label: 'Avg Delivery', value: '28 min', icon: Timer }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 group">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Filters and Controls */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-lg font-semibold text-gray-800">
                {sortedRestaurants.length} restaurants found
              </span>
              
              {/* Active Filters Display */}
              {(selectedFilters.cuisine.length > 0 || selectedFilters.features.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.cuisine.map(cuisine => (
                    <span key={cuisine} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      {cuisine}
                      <X 
                        className="h-3 w-3 ml-2 cursor-pointer hover:text-orange-600" 
                        onClick={() => handleFilterChange('cuisine', cuisine)}
                      />
                    </span>
                  ))}
                  {selectedFilters.features.map(feature => (
                    <span key={feature} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      {filterFeatures.find(f => f.id === feature)?.label}
                      <X 
                        className="h-3 w-3 ml-2 cursor-pointer hover:text-blue-600" 
                        onClick={() => handleFilterChange('features', feature)}
                      />
                    </span>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-red-600 text-sm font-medium underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 cursor-pointer rounded-full transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-orange-600' 
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 cursor-pointer rounded-full transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-orange-600' 
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Cuisine Filter */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Cuisine</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cuisineTypes.map(cuisine => (
                      <label key={cuisine} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.cuisine.includes(cuisine)}
                          onChange={() => handleFilterChange('cuisine', cuisine)}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map(rating => (
                      <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={selectedFilters.rating === rating.toString()}
                          onChange={() => handleFilterChange('rating', rating.toString())}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-700">{rating}+</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {['₹', '₹₹', '₹₹₹', '₹₹₹₹'].map(price => (
                      <label key={price} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          value={price}
                          checked={selectedFilters.priceRange === price}
                          onChange={() => handleFilterChange('priceRange', price)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features Filter */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
                  <div className="space-y-2">
                    {filterFeatures.map(feature => (
                      <label key={feature.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.features.includes(feature.id)}
                          onChange={() => handleFilterChange('features', feature.id)}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        <feature.icon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{feature.label}</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.isOpen}
                        onChange={() => handleFilterChange('isOpen', true)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Open Now</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Restaurant Grid/List */}
        <div className={`grid gap-6 mb-12 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {paginatedRestaurants.map((restaurant) => (
            <div 
              key={restaurant._id}
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                <img 
                  src={import.meta.env.VITE_BACKEND_URL + restaurant.bannerImage} 
                  alt={restaurant.restaurantName}
                  className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-56'
                  }`}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                {/* Top badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {restaurant.isPromoted && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                      PROMOTED
                    </span>
                  )}
                  {restaurant.isTrending && (
                    <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      TRENDING
                    </span>
                  )}
                  {restaurant.fastDelivery && (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                      FAST DELIVERY
                    </span>
                  )}
                  {restaurant.pureVeg && (
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                      PURE VEG
                    </span>
                  )}
                  {restaurant.isVerified && (
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      VERIFIED
                    </span>
                  )}
                </div>
                
                {/* Heart/Favorite & Share */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant._id);
                    }}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 group/heart"
                  >
                    <Heart 
                      className={`h-5 w-5 ${favorites.has(restaurant._id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600 group-hover/heart:text-red-500'
                      } transition-all duration-300`} 
                    />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                {/* Bottom info overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="flex gap-2">
                    {restaurant.offers.slice(0, 1).map((offer, index) => (
                      <div key={index} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full shadow-lg">
                        <span className="text-xs font-bold">{offer}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center space-x-1">
                        <Timer className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-800">{restaurant.deliveryTime || "40-45Mins"}</span>
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center space-x-1">
                        <Navigation className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-800">{restaurant.distance < 5000 ? "Nearby" : (restaurant.distance/1000).toFixed(1) + "km"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className={`absolute bottom-4 left-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  restaurant.isOpen 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {restaurant.isOpen ? 'OPEN' : 'CLOSED'}
                </div>
              </div>

              <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                      {restaurant.restaurantName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurant.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {restaurant.cuisines.slice(0, 3).map((cuisine, index) => (
                        <span key={index} className="bg-gray-100 font-medium text-gray-700 px-2 py-1 rounded-md text-xs">
                          {cuisine}
                        </span>
                      ))}
                      {restaurant.cuisines.length > 3 && (
                        <span className="text-gray-500 text-xs">+{restaurant.cuisines.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-green-600 fill-green-600" />
                      <span className="text-sm font-bold text-green-600">{restaurant.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({restaurant.orders.length} orders)</span>
                    <span className="text-sm font-semibold text-gray-700">{restaurant.priceRange}</span>
                  </div>
                </div>

                {/* Restaurant Details */}
                <div className={`space-y-3 mb-4 text-sm text-gray-600 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="line-clamp-1">{restaurant.address.street}, {restaurant.address.city}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>+91 {restaurant.phone}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order Now
                  </button>
                  <button className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedRestaurants.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">No restaurants found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any restaurants matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-12">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 || 
                page === currentPage + 2
              ) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              return null;
            })}
            
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <CartButton />

      <Footer />
    </div>
  );
};

export default RestaurantsPage;