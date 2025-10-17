import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  MapPin,
  ChevronDown,
  Heart,
  TrendingUp,
  Award,
  Zap,
  Leaf,
  Check,
  X,
  Navigation,
  Timer,
  Grid3X3,
  List,
  ArrowRight,
  ShoppingCart,
  Eye,
  AlertCircle
} from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    rating: '',
    priceRange: [],
    cuisines: [],
    features: []
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSearchResults();
  }, [query]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [restaurants, filters, sortBy]);

  const fetchSearchResults = () => {
    // Mock search results - replace with actual API call
    const mockResults = [
      {
        _id: '1',
        restaurantName: 'The Spice Route',
        description: 'Authentic North Indian cuisine with traditional flavors',
        bannerImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop',
        cuisines: ['North Indian', 'Mughlai', 'Biryani'],
        rating: 4.5,
        totalReviews: 2847,
        priceRange: '₹₹',
        deliveryTime: '25-30 min',
        distance: '1.2 km',
        isOpen: true,
        isVerified: true,
        isTrending: true,
        isPromoted: true,
        fastDelivery: true,
        pureVeg: false,
        offers: ['50% OFF up to ₹100', 'Free Delivery']
      },
      {
        _id: '2',
        restaurantName: 'Pizza Palace',
        description: 'Wood-fired authentic Italian pizzas',
        bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop',
        cuisines: ['Italian', 'Pizza', 'Continental'],
        rating: 4.7,
        totalReviews: 3241,
        priceRange: '₹₹₹',
        deliveryTime: '30-35 min',
        distance: '2.1 km',
        isOpen: true,
        isVerified: true,
        isTrending: false,
        isPromoted: true,
        fastDelivery: false,
        pureVeg: true,
        offers: ['40% OFF']
      },
      {
        _id: '3',
        restaurantName: 'Burger Junction',
        description: 'Gourmet burgers with premium ingredients',
        bannerImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop',
        cuisines: ['American', 'Fast Food', 'Burgers'],
        rating: 4.3,
        totalReviews: 1456,
        priceRange: '₹₹',
        deliveryTime: '20-25 min',
        distance: '0.8 km',
        isOpen: true,
        isVerified: true,
        isTrending: true,
        isPromoted: false,
        fastDelivery: true,
        pureVeg: false,
        offers: ['₹125 OFF above ₹249']
      },
      {
        _id: '4',
        restaurantName: 'Sushi Zen',
        description: 'Premium Japanese cuisine with fresh sashimi',
        bannerImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop',
        cuisines: ['Japanese', 'Sushi', 'Asian'],
        rating: 4.6,
        totalReviews: 987,
        priceRange: '₹₹₹₹',
        deliveryTime: '40-45 min',
        distance: '3.5 km',
        isOpen: false,
        isVerified: true,
        isTrending: false,
        isPromoted: false,
        fastDelivery: false,
        pureVeg: false,
        offers: []
      }
    ];
    setRestaurants(mockResults);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...restaurants];

    // Apply filters
    if (filters.rating) {
      filtered = filtered.filter(r => r.rating >= parseFloat(filters.rating));
    }
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(r => filters.priceRange.includes(r.priceRange));
    }
    if (filters.cuisines.length > 0) {
      filtered = filtered.filter(r => 
        r.cuisines.some(c => filters.cuisines.includes(c))
      );
    }
    if (filters.features.length > 0) {
      filtered = filtered.filter(r => 
        filters.features.every(f => r[f] === true)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        break;
    }

    setFilteredRestaurants(filtered);
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      if (category === 'rating') {
        return { ...prev, rating: prev.rating === value ? '' : value };
      }
      const currentArray = prev[category];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [category]: newArray };
    });
  };

  const clearFilters = () => {
    setFilters({
      rating: '',
      priceRange: [],
      cuisines: [],
      features: []
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cuisinesList = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican', 'Japanese', 'Thai', 'Continental'];
  const featuresList = [
    { id: 'pureVeg', label: 'Pure Veg', icon: Leaf },
    { id: 'fastDelivery', label: 'Fast Delivery', icon: Zap },
    { id: 'isTrending', label: 'Trending', icon: TrendingUp },
    { id: 'isVerified', label: 'Verified', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header with Search */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Search Results</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full pl-14 pr-4 py-4 bg-white text-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 placeholder-gray-500 text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <p className="text-white/90 mt-4 text-lg">
              Showing results for "<span className="font-bold">{query}</span>" 
              <span className="ml-2">({filteredRestaurants.length} restaurants found)</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
                {(filters.rating || filters.priceRange.length > 0 || filters.cuisines.length > 0 || filters.features.length > 0) && (
                  <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {[filters.rating ? 1 : 0, filters.priceRange.length, filters.cuisines.length, filters.features.length].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="deliveryTime">Delivery Time</option>
                <option value="distance">Distance</option>
              </select>
            </div>

            {(filters.rating || filters.priceRange.length > 0 || filters.cuisines.length > 0 || filters.features.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-600 font-semibold flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Rating Filter */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Rating</h4>
                <div className="space-y-2">
                  {['4.5', '4.0', '3.5'].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.rating === rating}
                        onChange={() => toggleFilter('rating', rating)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm">{rating}+</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {['₹', '₹₹', '₹₹₹', '₹₹₹₹'].map(price => (
                    <label key={price} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.priceRange.includes(price)}
                        onChange={() => toggleFilter('priceRange', price)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cuisines */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Cuisines</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cuisinesList.map(cuisine => (
                    <label key={cuisine} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.cuisines.includes(cuisine)}
                        onChange={() => toggleFilter('cuisines', cuisine)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
                <div className="space-y-2">
                  {featuresList.map(feature => (
                    <label key={feature.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature.id)}
                        onChange={() => toggleFilter('features', feature.id)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <feature.icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                  <img
                    src={restaurant.bannerImage}
                    alt={restaurant.restaurantName}
                    className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                      viewMode === 'list' ? 'w-full h-full' : 'w-full h-56'
                    }`}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {restaurant.isPromoted && (
                      <span className="bg-yellow-400 text-white text-xs px-3 py-1 rounded-full font-bold">PROMOTED</span>
                    )}
                    {restaurant.isTrending && (
                      <span className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />TRENDING
                      </span>
                    )}
                    {restaurant.fastDelivery && (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">FAST</span>
                    )}
                    {restaurant.pureVeg && (
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>VEG
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFavorite(restaurant._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  >
                    <Heart className={`h-5 w-5 ${favorites.has(restaurant._id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                  </button>

                  <div className={`absolute ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-3 py-1 rounded-full font-bold top-4 right-16`}>
                    {restaurant.isOpen ? 'OPEN' : 'CLOSED'}
                  </div>

                  {/* Bottom badges */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    {restaurant.offers.length > 0 && (
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {restaurant.offers[0]}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <Timer className="h-3 w-3 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-800">{restaurant.deliveryTime}</span>
                        </div>
                      </div>
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <Navigation className="h-3 w-3 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-800">{restaurant.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                        {restaurant.restaurantName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurant.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {restaurant.cuisines.slice(0, 3).map((cuisine, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-green-600 fill-green-600" />
                        <span className="text-sm font-bold text-green-600">{restaurant.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({restaurant.totalReviews})</span>
                      <span className="text-sm font-semibold text-gray-700">{restaurant.priceRange}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Order Now
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl transition-all duration-300 flex items-center">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;