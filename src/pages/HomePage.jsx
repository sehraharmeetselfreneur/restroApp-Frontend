import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Pizza, 
  Coffee, 
  IceCream, 
  Wine,
  Gift,
  Truck,
  Zap,
  Shield,
  CreditCard,
  Star,
  Facebook,
  Twitter,
  Download,
  Smartphone,
  MapPin,
  Clock,
  Heart,
  Filter,
  ChevronDown,
  Play,
  Award,
  TrendingUp,
  Users,
  Percent,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Flame,
  Crown,
  Target,
  Globe
} from 'lucide-react';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import RestaurantGrid from '../components/home/RestaurantGrid';
import useAuthStore from '../store/useAuthStore';

const Homepage = () => {
  const { user, role } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Faridabad, Haryana');
  const [activeTab, setActiveTab] = useState('delivery');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  // Auto-scroll for hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categoryItems = [
    { icon: Pizza, name: 'Pizza', color: 'bg-gradient-to-br from-orange-400 to-red-500', offers: '40% Off' },
    { icon: Coffee, name: 'Biryani', color: 'bg-gradient-to-br from-yellow-400 to-orange-500', offers: '₹100 Off' },
    { icon: IceCream, name: 'Desserts', color: 'bg-gradient-to-br from-pink-400 to-purple-500', offers: 'Buy 1 Get 1' },
    { icon: Wine, name: 'Drinks', color: 'bg-gradient-to-br from-blue-400 to-indigo-500', offers: '30% Off' },
    { icon: Crown, name: 'Premium', color: 'bg-gradient-to-br from-purple-400 to-pink-500', offers: 'Exclusive' },
    { icon: Flame, name: 'Trending', color: 'bg-gradient-to-br from-red-400 to-pink-500', offers: 'Hot Deals' },
    { icon: Target, name: 'Healthy', color: 'bg-gradient-to-br from-green-400 to-emerald-500', offers: 'Fresh' },
    { icon: Globe, name: 'Global', color: 'bg-gradient-to-br from-cyan-400 to-blue-500', offers: 'New' }
  ];

  const featuredRestaurants = [
    {
      id: 1,
      name: 'The Spice Route',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      rating: 4.5,
      reviews: 2847,
      price: '₹₹',
      time: '25-30 min',
      distance: '1.2 km',
      cuisine: 'North Indian, Mughlai',
      offer: '50% OFF up to ₹100',
      promoted: true,
      pure_veg: false,
      fast_delivery: true
    },
    {
      id: 2,
      name: 'Burger Junction',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      rating: 4.3,
      reviews: 1456,
      price: '₹₹',
      time: '20-25 min',
      distance: '0.8 km',
      cuisine: 'American, Fast Food',
      offer: '₹125 OFF above ₹249',
      promoted: false,
      pure_veg: false,
      fast_delivery: true
    },
    {
      id: 3,
      name: 'Pizza Palace',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 3241,
      price: '₹₹₹',
      time: '30-35 min',
      distance: '2.1 km',
      cuisine: 'Italian, Pizza',
      offer: '40% OFF + Free Delivery',
      promoted: true,
      pure_veg: true,
      fast_delivery: false
    },
    {
      id: 4,
      name: 'Sushi Zen',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      rating: 4.6,
      reviews: 987,
      price: '₹₹₹₹',
      time: '40-45 min',
      distance: '3.5 km',
      cuisine: 'Japanese, Sushi',
      offer: 'Premium Exclusive',
      promoted: false,
      pure_veg: false,
      fast_delivery: false
    },
    {
      id: 5,
      name: 'Taco Fiesta',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
      rating: 4.4,
      reviews: 1876,
      price: '₹₹',
      time: '35-40 min',
      distance: '1.9 km',
      cuisine: 'Mexican, Tex-Mex',
      offer: 'Buy 2 Get 1 Free',
      promoted: false,
      pure_veg: false,
      fast_delivery: true
    },
    {
      id: 6,
      name: 'Green Bowl',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      rating: 4.2,
      reviews: 654,
      price: '₹₹',
      time: '25-30 min',
      distance: '1.7 km',
      cuisine: 'Healthy, Salads',
      offer: '30% OFF on Healthy Food',
      promoted: false,
      pure_veg: true,
      fast_delivery: true
    }
  ];

  const heroSlide = {
    title: "Premium dining,",
    subtitle: "at your doorstep",
    bg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop",
    cta: "Browse Menu"
  };

  const herobg = [
    { bg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop", index: 0 },
    { bg: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&h=800&fit=crop", index: 1 },
    { bg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop", index: 2 }
  ]

  const stats = [
    { icon: Users, value: '10M+', label: 'Happy Customers' },
    { icon: Award, value: '50K+', label: 'Restaurant Partners' },
    { icon: TrendingUp, value: '100M+', label: 'Successful Deliveries' },
    { icon: Globe, value: '500+', label: 'Service Locations' }
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

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Enhanced Header */}
      <Navbar location={location}/>

      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute min-h-full inset-0">
          {herobg.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.bg} 
                alt="Hero background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-orange-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-32 h-32 bg-red-500/20 rounded-full animate-bounce"></div>

        <div className="relative z-10 max-w-full mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-start">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full px-20 pt-4">
            <div className="space-y-4 animate-fadeInUp">
              {/* Service Type Tabs */}
              <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 max-w-md">
                {[
                  { id: 'delivery', label: 'Delivery', icon: Truck },
                  { id: 'pickup', label: 'Pickup', icon: Clock },
                  { id: 'dine', label: 'Dine-in', icon: Users }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center cursor-pointer space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 flex-1 justify-center ${
                      activeTab === tab.id 
                        ? 'bg-white text-gray-800 shadow-lg' 
                        : 'text-white/80 hover:text-white hover:bg-white/30'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">{heroSlide.title}</span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    {heroSlide.subtitle}
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                  Discover amazing food & restaurants around you. Premium quality, lightning-fast delivery, unbeatable prices.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                      <stat.icon className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Food Grid */}
            <div className="hidden lg:block h-[70%] w-full items-center">
              <div className="grid grid-cols-3 h-full w-full gap-6">
                {/* Column 1 */}
                <div className="space-y-6 animate-float">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl hover:scale-105 transition-all duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=250&fit=crop" 
                      alt="Food" 
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="p-4">
                      <h4 className="text-white font-semibold">Spicy Biryani</h4>
                      <p className="text-gray-300 text-sm">₹299 • 4.5⭐</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl hover:scale-105 transition-all duration-500 delay-100">
                    <img 
                      src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop" 
                      alt="Food" 
                      className="w-full h-32 object-cover rounded-2xl"
                    />
                    <div className="p-4">
                      <h4 className="text-white font-semibold">Gourmet Burger</h4>
                      <p className="text-gray-300 text-sm">₹199 • 4.3⭐</p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6 mt-12 animate-float-delayed">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl hover:scale-105 transition-all duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=300&fit=crop" 
                      alt="Pizza" 
                      className="w-full h-56 object-cover rounded-2xl"
                    />
                    <div className="p-4">
                      <h4 className="text-white font-semibold">Margherita Pizza</h4>
                      <p className="text-gray-300 text-sm">₹399 • 4.7⭐</p>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-6 animate-float">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl hover:scale-105 transition-all duration-500 delay-200">
                    <img 
                      src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop" 
                      alt="Salad" 
                      className="w-full h-40 object-cover rounded-2xl"
                    />
                    <div className="p-4">
                      <h4 className="text-white font-semibold">Fresh Salad</h4>
                      <p className="text-gray-300 text-sm">₹149 • 4.2⭐</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl hover:scale-105 transition-all duration-500 delay-300">
                    <img 
                      src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop" 
                      alt="Food" 
                      className="w-full h-32 object-cover rounded-2xl"
                    />
                    <div className="p-4">
                      <h4 className="text-white font-semibold">Pasta Delight</h4>
                      <p className="text-gray-300 text-sm">₹249 • 4.4⭐</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {herobg.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(_.index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-full flex flex-col justify-center px-4 sm:px-6 lg:px-25 py-20">
        {/* Enhanced Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What's on your mind?</h2>
            <p className="text-xl text-gray-600">Explore cuisines and get exclusive offers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-6">
            {categoryItems.map((item, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className={`${item.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="text-center relative z-10">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">{item.name}</h3>
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {item.offers}
                    </span>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Restaurant Grid */}
        <RestaurantGrid />

        {/* Premium Features Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
              <h2 className="text-5xl font-bold mb-6">Why Choose EAT&GO Premium?</h2>
              <p className="text-xl mb-12 text-white/90">Experience the ultimate food delivery service with exclusive benefits</p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Zap,
                    title: 'Lightning Fast Delivery',
                    description: 'Get your food delivered in under 30 minutes with our express delivery network.'
                  },
                  {
                    icon: Shield,
                    title: 'Premium Quality Assurance',
                    description: 'Every restaurant is verified and maintains the highest hygiene standards.'
                  },
                  {
                    icon: Gift,
                    title: 'Exclusive Offers & Rewards',
                    description: 'Access to premium deals, cashback offers, and loyalty rewards program.'
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-white/90">{feature.description}</p>
                  </div>
                ))}
              </div>
              
              <button className="mt-12 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Upgrade to Premium <Crown className="inline ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 relative overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Get the EAT&GO app
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Download our app for the fastest food delivery experience. Available on iOS and Android.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Zap, title: 'Faster Ordering', desc: 'Order in just 3 taps' },
                    { icon: CreditCard, title: 'Easy Payments', desc: 'Multiple payment options' },
                    { icon: Award, title: 'Exclusive App Offers', desc: 'Special discounts for app users' },
                    { icon: Users, title: 'Track Everything', desc: 'Real-time order tracking' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{feature.title}</h4>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:shadow-lg transition-all transform hover:scale-105">
                    <Download className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-sm font-bold">App Store</div>
                    </div>
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:shadow-lg transition-all transform hover:scale-105">
                    <Download className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="text-sm font-bold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Smartphone className="h-16 w-16 text-white mx-auto mb-6" />
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Pizza className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Coffee className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What our customers say</h2>
            <p className="text-xl text-gray-600">Real reviews from real customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                rating: 5,
                review: "Amazing food quality and super fast delivery! The app is so easy to use and the customer service is outstanding.",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c9?w=100&h=100&fit=crop&crop=face"
              },
              {
                name: "Rahul Kumar",
                rating: 5,
                review: "Best food delivery service in the city. Fresh ingredients, hot food, and always on time. Highly recommended!",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              },
              {
                name: "Anjali Gupta",
                rating: 5,
                review: "Love the variety of restaurants and cuisines available. The premium membership is totally worth it!",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Enhanced Footer */}
      <Footer />

      {/* Floating Action Button */}
      {user && role === "Customer" &&
        <div className="fixed bottom-8 right-8 z-50">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8" />
            {user?.cart?.items?.length > 0 &&
                <span className="absolute -top-1 -right-0 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {user.cart.items.length}
                </span>
            }
          </button>
        </div>
      }
    </div>
  );
};

export default Homepage;