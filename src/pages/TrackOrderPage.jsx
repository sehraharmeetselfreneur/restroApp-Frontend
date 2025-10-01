import React, { useState, useEffect } from 'react';
import { 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChefHat,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Phone,
  Eye,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Home,
  DollarSign,
  Percent,
  Star,
  MessageSquare,
  Download
} from 'lucide-react';
import Navbar from '../components/home/Navbar';

const TrackOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [selectedStatus, searchQuery, orders]);

  const fetchOrders = () => {
    // Mock orders data - replace with actual API call
    const mockOrders = [
      {
        _id: "order1",
        customer_id: "customer123",
        restaurant_id: {
          _id: "rest1",
          restaurantName: "The Spice Route",
          phone: "+91 98765 43210"
        },
        orderStatus: "delivered",
        paymentStatus: "paid",
        paymentType: "COD",
        items: [
          {
            foodItem: {
              _id: "food1",
              name: "Chicken Biryani",
              images: ["/path/to/image1.jpg"],
              isVeg: false
            },
            variant: "Large",
            quantity: 2,
            price: 450,
            subtotal: 900
          }
        ],
        special_instructions: "Extra spicy please",
        totalAmount: 900,
        deliveryFee: 50,
        discountApplied: 100,
        finalAmount: 850,
        deliveryAddress: {
          street: "Sector 15, Main Market",
          city: "Faridabad",
          state: "Haryana",
          pincode: "121007",
          landmark: "Near Metro Station"
        },
        createdAt: "2025-01-15T10:30:00.000Z",
        deliveredAt: "2025-01-15T11:45:00.000Z"
      },
      {
        _id: "order2",
        customer_id: "customer123",
        restaurant_id: {
          _id: "rest2",
          restaurantName: "Pizza Palace",
          phone: "+91 98765 43211"
        },
        orderStatus: "outForDelivery",
        paymentStatus: "paid",
        paymentType: "COD",
        items: [
          {
            foodItem: {
              _id: "food2",
              name: "Margherita Pizza",
              images: ["/path/to/image2.jpg"],
              isVeg: true
            },
            variant: "Medium",
            quantity: 1,
            price: 399,
            subtotal: 399
          }
        ],
        special_instructions: "",
        totalAmount: 399,
        deliveryFee: 0,
        discountApplied: 0,
        finalAmount: 399,
        deliveryAddress: {
          street: "Tower A, Cyber City",
          city: "Gurgaon",
          state: "Haryana",
          pincode: "122002",
          landmark: "DLF Phase 2"
        },
        createdAt: "2025-01-16T14:20:00.000Z",
        outForDeliveryAt: "2025-01-16T14:50:00.000Z"
      },
      {
        _id: "order3",
        customer_id: "customer123",
        restaurant_id: {
          _id: "rest3",
          restaurantName: "Burger Junction",
          phone: "+91 98765 43212"
        },
        orderStatus: "preparing",
        paymentStatus: "paid",
        paymentType: "COD",
        items: [
          {
            foodItem: {
              _id: "food3",
              name: "Chicken Burger",
              images: ["/path/to/image3.jpg"],
              isVeg: false
            },
            variant: null,
            quantity: 3,
            price: 220,
            subtotal: 660
          }
        ],
        special_instructions: "No onions",
        totalAmount: 660,
        deliveryFee: 50,
        discountApplied: 60,
        finalAmount: 650,
        deliveryAddress: {
          street: "Sector 15, Main Market",
          city: "Faridabad",
          state: "Haryana",
          pincode: "121007",
          landmark: "Near Metro Station"
        },
        createdAt: "2025-01-16T16:00:00.000Z"
      }
    ];
    setOrders(mockOrders);
  };

  const filterOrders = () => {
    let filtered = orders;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.restaurant_id.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock, label: 'Pending' },
    accepted: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle, label: 'Accepted' },
    preparing: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: ChefHat, label: 'Preparing' },
    outForDelivery: { color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: Truck, label: 'Out for Delivery' },
    delivered: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle, label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, label: 'Cancelled' },
    refunded: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: RefreshCw, label: 'Refunded' }
  };

  const filterButtons = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'outForDelivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Track Orders</h1>
          </div>
          <p className="text-white/90 text-lg">
            View and track all your orders in one place
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or restaurant name..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {filterButtons.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStatus(filter.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedStatus === filter.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedStatus !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Start ordering to see your order history here'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const config = statusConfig[order.orderStatus];
              const StatusIcon = config.icon;

              return (
                <div 
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {order.restaurant_id.restaurantName}
                          </h3>
                          <p className="text-sm text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`${config.color} px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center space-x-2`}>
                          <StatusIcon className="h-4 w-4" />
                          <span>{config.label}</span>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors duration-300 flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                              <div className={`w-3 h-3 rounded-full ${item.foodItem.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800">{item.foodItem.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {item.variant && `${item.variant} • `}Qty: {item.quantity} • ₹{item.price} each
                                </p>
                              </div>
                              <div className="font-bold text-orange-600">₹{item.subtotal}</div>
                            </div>
                          ))}
                        </div>

                        {order.special_instructions && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 text-blue-600 mt-1" />
                              <div>
                                <p className="text-sm font-semibold text-blue-800">Special Instructions</p>
                                <p className="text-sm text-blue-700">{order.special_instructions}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-800 mb-4">Order Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-semibold">₹{order.totalAmount}</span>
                            </div>
                            {order.discountApplied > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span className="font-semibold">-₹{order.discountApplied}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Delivery Fee</span>
                              <span className="font-semibold">
                                {order.deliveryFee === 0 ? (
                                  <span className="text-green-600">FREE</span>
                                ) : (
                                  `₹${order.deliveryFee}`
                                )}
                              </span>
                            </div>
                            <div className="pt-3 border-t border-gray-300">
                              <div className="flex justify-between">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-bold text-orange-600 text-lg">₹{order.finalAmount}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Ordered: {formatDate(order.createdAt)}</span>
                          </div>
                          {order.deliveredAt && (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Delivered: {formatDate(order.deliveredAt)}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CreditCard className="h-4 w-4" />
                            <span>Payment: {order.paymentType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h2>
                  <p className="text-gray-600">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-12 h-12 hover:bg-gray-200 rounded-xl transition-colors duration-300 flex items-center justify-center"
                >
                  <XCircle className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Restaurant Info */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Restaurant Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ChefHat className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">{selectedOrder.restaurant_id.restaurantName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <span>{selectedOrder.restaurant_id.phone}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                  Delivery Address
                </h3>
                <p className="text-gray-700">
                  {selectedOrder.deliveryAddress.street}<br />
                  {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                  {selectedOrder.deliveryAddress.landmark && (
                    <><br />Landmark: {selectedOrder.deliveryAddress.landmark}</>
                  )}
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-semibold">{selectedOrder.paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className={`font-semibold ${
                      selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download Invoice</span>
                </button>
                {selectedOrder.orderStatus === 'delivered' && (
                  <button className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Rate Order</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;