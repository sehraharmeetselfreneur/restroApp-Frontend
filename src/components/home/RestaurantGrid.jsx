import React, { useEffect, useState } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Heart, 
  Clock, 
  Star, 
  ArrowRight,
  Percent,
  MapPin,
  Zap,
  Award,
  Leaf,
  TrendingUp,
  SlidersHorizontal,
  Grid3X3,
  List
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { getNearByRestaurants } from '../../api/homeApi';
import useAuthStore from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';

const RestaurantGrid = ({ location = "Delhi" }) => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState(new Set([2, 5, 8])); // Pre-selected favorites
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('rating');
    const [nearByRestaurants, setNearByRestaurants] = useState({});

    const getNearByRestaurantsMutation = useMutation({
        mutationFn: getNearByRestaurants,
        onSuccess: (data) => {
            setNearByRestaurants(data);
        },
        onError: (error) => {
            toast.error(error.response.data?.message);
        }
    });

    // Extended restaurant data
    const featuredRestaurants = [
        {
            id: 1,
            name: 'The Spice Route',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
            rating: 4.5,
            reviews: 2847,
            price: '₹₹',
            time: '25-30 min',
            distance: '1.2 km',
            cuisine: 'North Indian, Mughlai',
            offer: '50% OFF up to ₹100',
            promoted: true,
            pure_veg: false,
            fast_delivery: true,
            trending: false
        },
        {
            id: 2,
            name: 'Burger Junction',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=250&fit=crop',
            rating: 4.3,
            reviews: 1456,
            price: '₹₹',
            time: '20-25 min',
            distance: '0.8 km',
            cuisine: 'American, Fast Food',
            offer: '₹125 OFF above ₹249',
            promoted: false,
            pure_veg: false,
            fast_delivery: true,
            trending: true
        },
        {
            id: 3,
            name: 'Pizza Palace',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop',
            rating: 4.7,
            reviews: 3241,
            price: '₹₹₹',
            time: '30-35 min',
            distance: '2.1 km',
            cuisine: 'Italian, Pizza',
            offer: '40% OFF + Free Delivery',
            promoted: true,
            pure_veg: true,
            fast_delivery: false,
            trending: false
        },
        {
            id: 4,
            name: 'Sushi Zen',
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=250&fit=crop',
            rating: 4.6,
            reviews: 987,
            price: '₹₹₹₹',
            time: '40-45 min',
            distance: '3.5 km',
            cuisine: 'Japanese, Sushi',
            offer: 'Premium Exclusive',
            promoted: false,
            pure_veg: false,
            fast_delivery: false,
            trending: false
        },
        {
            id: 5,
            name: 'Taco Fiesta',
            image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=250&fit=crop',
            rating: 4.4,
            reviews: 1876,
            price: '₹₹',
            time: '35-40 min',
            distance: '1.9 km',
            cuisine: 'Mexican, Tex-Mex',
            offer: 'Buy 2 Get 1 Free',
            promoted: false,
            pure_veg: false,
            fast_delivery: true,
            trending: true
        },
        {
            id: 6,
            name: 'Green Bowl',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop',
            rating: 4.2,
            reviews: 654,
            price: '₹₹',
            time: '25-30 min',
            distance: '1.7 km',
            cuisine: 'Healthy, Salads',
            offer: '30% OFF on Healthy Food',
            promoted: false,
            pure_veg: true,
            fast_delivery: true,
            trending: false
        },
        {
            id: 7,
            name: 'Biryani Express',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d51d?w=400&h=250&fit=crop',
            rating: 4.8,
            reviews: 4532,
            price: '₹₹',
            time: '30-35 min',
            distance: '2.3 km',
            cuisine: 'Biryani, Hyderabadi',
            offer: 'Free Raita with Biryani',
            promoted: true,
            pure_veg: false,
            fast_delivery: true,
            trending: true
        },
        {
            id: 8,
            name: 'Dessert Dreams',
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=250&fit=crop',
            rating: 4.5,
            reviews: 892,
            price: '₹₹',
            time: '20-25 min',
            distance: '1.4 km',
            cuisine: 'Desserts, Ice Cream',
            offer: '25% OFF on Orders Above ₹199',
            promoted: false,
            pure_veg: true,
            fast_delivery: true,
            trending: false
        },
        {
            id: 9,
            name: 'Café Mocha',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=250&fit=crop',
            rating: 4.1,
            reviews: 567,
            price: '₹₹',
            time: '15-20 min',
            distance: '0.9 km',
            cuisine: 'Coffee, Snacks',
            offer: 'Flat ₹50 OFF on Beverages',
            promoted: false,
            pure_veg: true,
            fast_delivery: true,
            trending: false
        },
        {
            id: 10,
            name: 'Thai Garden',
            image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=250&fit=crop',
            rating: 4.4,
            reviews: 1234,
            price: '₹₹₹',
            time: '35-40 min',
            distance: '2.8 km',
            cuisine: 'Thai, Asian',
            offer: 'Authentic Thai at 20% OFF',
            promoted: false,
            pure_veg: false,
            fast_delivery: false,
            trending: false
        },
        {
            id: 11,
            name: 'Street Food Hub',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=250&fit=crop',
            rating: 4.3,
            reviews: 2156,
            price: '₹',
            time: '25-30 min',
            distance: '1.6 km',
            cuisine: 'Street Food, Chaat',
            offer: 'Combo Deals Starting ₹99',
            promoted: false,
            pure_veg: true,
            fast_delivery: true,
            trending: true
        },
        {
            id: 12,
            name: 'Ocean Delights',
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop',
            rating: 4.6,
            reviews: 1789,
            price: '₹₹₹',
            time: '45-50 min',
            distance: '3.2 km',
            cuisine: 'Seafood, Continental',
            offer: 'Fresh Catch of the Day',
            promoted: false,
            pure_veg: false,
            fast_delivery: false,
            trending: false
        }
    ];

    const filterOptions = [
        { id: 'all', label: 'All Restaurants', icon: Grid3X3 },
        { id: 'fastDelivery', label: 'Fast Delivery', icon: Zap },
        { id: 'pureVeg', label: 'Pure Veg', icon: Leaf },
        { id: 'isPromoted', label: 'Promoted', icon: Award },
        { id: 'isTrending', label: 'Trending', icon: TrendingUp }
    ];

    const sortOptions = [
        { id: 'rating', label: 'Rating' },
        { id: 'delivery_time', label: 'Delivery Time' },
        { id: 'distance', label: 'Distance' },
        { id: 'price_low', label: 'Price: Low to High' },
        { id: 'price_high', label: 'Price: High to Low' }
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

    // Filter restaurants based on selected filter
    const filteredRestaurants = nearByRestaurants?.restaurants?.filter(restaurant => {
        if (selectedFilter === 'all') return true;
        return restaurant[selectedFilter] === true;
    });

    useEffect(() => {
        getNearByRestaurantsMutation.mutate({ user });
    }, []);

    useEffect(() => {
        console.log(nearByRestaurants);
    }, [nearByRestaurants]);

    return (
        <section className="mb-20">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Top restaurant chains in {user ? user.profile.address[0]?.city : location}
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                {nearByRestaurants.restaurantCount || 0} restaurants • Best food near you
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filters */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex cursor-pointer items-center space-x-2 bg-white border-2 border-gray-200 hover:border-orange-500 px-4 py-2.5 rounded-full font-medium transition-all hover:shadow-lg"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:block">Filters</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 py-2 w-56 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm">Filter by</h3>
                    </div>
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedFilter(option.id);
                          setShowFilters(false);
                        }}
                        className={`flex cursor-pointer items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedFilter === option.id ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                        }`}
                      >
                        <option.icon className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setShowRating(!showRating)}
                  className="flex cursor-pointer items-center space-x-2 bg-white border-2 border-gray-200 hover:border-orange-500 px-4 py-2.5 rounded-full font-medium transition-all hover:shadow-lg"
                >
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:block">Rating</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showRating ? 'rotate-180' : ''}`} />
                </button>

                {showRating && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 py-2 w-56 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm">Rating by</h3>
                    </div>
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedFilter(option.id);
                          setShowRating(false);
                        }}
                        className={`flex cursor-pointer items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedFilter === option.id ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {filterOptions.slice(1).map((option) => {
              const count = nearByRestaurants?.restaurants?.filter(r => r[option.id] === true).length;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedFilter(selectedFilter === option.id ? 'all' : option.id)}
                  className={`flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 border-2 ${
                    selectedFilter === option.id
                      ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  <span className="text-sm">{option.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedFilter === option.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Restaurant Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {filteredRestaurants?.map((restaurant) => (
              <div 
                key={restaurant._id}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img 
                    src={import.meta.env.VITE_BACKEND_URL + restaurant.bannerImage} 
                    alt={restaurant.name}
                    className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                      viewMode === 'list' ? 'w-full h-full' : 'w-full h-40 sm:h-44'
                    }`}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                  {/* Top badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap w-60 gap-1">
                    {restaurant.isPromoted && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-md">
                        PROMOTED
                      </span>
                    )}
                    {restaurant.isTrending && (
                      <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-md flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        TRENDING
                      </span>
                    )}
                    {restaurant.fastDelivery && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-md">
                        FAST
                      </span>
                    )}
                    {restaurant.pureVeg && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-bold shadow-md flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                        VEG
                      </span>
                    )}
                  </div>
                
                  {/* Heart/Favorite */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant._id);
                    }}
                    className="absolute cursor-pointer top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 group/heart"
                  >
                    <Heart 
                      className={`h-4 w-4 ${favorites.has(restaurant._id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600 group-hover/heart:text-red-500'
                      } transition-all duration-300`}
                    />
                  </button>
                  
                  {/* Time and Distance */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-800">{restaurant.avgPrepTime || "40-45Mins"}</span>
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-800">{restaurant.distance < 5000 ? "Closest" : (restaurant.distance/1000).toFixed(1) + "km"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Offer badge */}
                  {restaurant.offers?.length > 0 && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full shadow-md">
                      <span className="text-xs font-bold">{restaurant.offer[0].title}</span>
                    </div>
                  )}
                </div>

                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {restaurant.restaurantName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-1">{restaurant.cuisines?.[0]}, {restaurant.cuisines?.[1]}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-md">
                        <Star className="h-3 w-3 text-green-600 fill-green-600" />
                        <span className="text-xs font-bold text-green-600">{restaurant.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({restaurant.reviews || 0})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <span className="text-sm font-semibold">{restaurant.price || 500}</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons - Only show on hover for grid view */}
                  <div className={`flex gap-2`}>
                    <button type='button' className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white cursor-pointer py-2 px-4 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      Order Now
                    </button>
                    <button type='button' className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg cursor-pointer font-medium text-sm transition-all duration-300">
                      Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredRestaurants?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
              <button 
                onClick={() => setSelectedFilter('all')}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Load More */}
          {nearByRestaurants?.restaurants?.length > 0 && (
            <div className="text-center mt-12">
              <Link to={"/restaurants"} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                View All Restaurants 
                <ArrowRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          )}
        </section>
    );
};

export default RestaurantGrid;