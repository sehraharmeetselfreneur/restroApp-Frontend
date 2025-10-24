import React, { useState } from 'react';
import { 
  Tag, Plus, X, Edit2, Trash2, Percent, Calendar, Clock, 
  ChefHat, Package, Search, Filter, DollarSign, Users, 
  TrendingUp, Gift, Sparkles, CheckCircle, AlertCircle
} from 'lucide-react';

// Create/Edit Offer Modal
const OfferModal = ({ isOpen, onClose, onSave, editingOffer, categories, foodItems }) => {
  const [offerData, setOfferData] = useState(editingOffer || {
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    offerType: 'category',
    applicableCategories: [],
    applicableFoodItems: [],
    minOrderValue: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: '',
    usagePerCustomer: ''
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (editingOffer) {
      setOfferData(editingOffer);
    }
  }, [editingOffer]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!offerData.name.trim()) newErrors.name = 'Offer name is required';
    if (!offerData.discountValue || offerData.discountValue <= 0) newErrors.discountValue = 'Valid discount value required';
    if (offerData.discountType === 'percentage' && offerData.discountValue > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }
    if (!offerData.startDate) newErrors.startDate = 'Start date is required';
    if (!offerData.endDate) newErrors.endDate = 'End date is required';
    if (offerData.startDate && offerData.endDate && new Date(offerData.startDate) >= new Date(offerData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (offerData.offerType === 'category' && offerData.applicableCategories.length === 0) {
      newErrors.applicableCategories = 'Select at least one category';
    }
    if (offerData.offerType === 'item' && offerData.applicableFoodItems.length === 0) {
      newErrors.applicableFoodItems = 'Select at least one food item';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(offerData);
      onClose();
      setOfferData({
        name: '', description: '', discountType: 'percentage', discountValue: '',
        offerType: 'category', applicableCategories: [], applicableFoodItems: [],
        minOrderValue: '', maxDiscount: '', startDate: '', endDate: '',
        isActive: true, usageLimit: '', usagePerCustomer: ''
      });
      setErrors({});
    }
  };

  const toggleCategory = (category) => {
    setOfferData(prev => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(category)
        ? prev.applicableCategories.filter(c => c !== category)
        : [...prev.applicableCategories, category]
    }));
  };

  const toggleFoodItem = (itemId) => {
    setOfferData(prev => ({
      ...prev,
      applicableFoodItems: prev.applicableFoodItems.includes(itemId)
        ? prev.applicableFoodItems.filter(id => id !== itemId)
        : [...prev.applicableFoodItems, itemId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white no-scrollbar rounded-3xl max-w-4xl w-full shadow-2xl my-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/30 bg-opacity-20 rounded-xl">
                <Gift size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h2>
                <p className="text-purple-100">Set up attractive deals for your customers</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-blue-600" size={20} />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Name *</label>
                <input
                  type="text"
                  value={offerData.name}
                  onChange={(e) => setOfferData({ ...offerData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Weekend Special"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={offerData.description}
                  onChange={(e) => setOfferData({ ...offerData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe your offer..."
                />
              </div>
            </div>
          </div>

          {/* Discount Configuration */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Percent className="text-green-600" size={20} />
              Discount Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type *</label>
                <select
                  value={offerData.discountType}
                  onChange={(e) => setOfferData({ ...offerData, discountType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value *</label>
                <input
                  type="number"
                  value={offerData.discountValue}
                  onChange={(e) => setOfferData({ ...offerData, discountValue: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.discountValue ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder={offerData.discountType === 'percentage' ? '10' : '100'}
                />
                {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Order Value (₹)</label>
                <input
                  type="number"
                  value={offerData.minOrderValue}
                  onChange={(e) => setOfferData({ ...offerData, minOrderValue: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Discount (₹)</label>
                <input
                  type="number"
                  value={offerData.maxDiscount}
                  onChange={(e) => setOfferData({ ...offerData, maxDiscount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="200"
                />
              </div>
            </div>
          </div>

          {/* Applicability */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-purple-600" size={20} />
              Offer Applicability
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apply To *</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setOfferData({ ...offerData, offerType: 'category' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    offerData.offerType === 'category'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <ChefHat size={18} className="inline mr-2" />
                  Categories
                </button>
                <button
                  onClick={() => setOfferData({ ...offerData, offerType: 'item' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    offerData.offerType === 'item'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <Package size={18} className="inline mr-2" />
                  Individual Items
                </button>
              </div>
            </div>

            {offerData.offerType === 'category' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Categories *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        offerData.applicableCategories.includes(category)
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {errors.applicableCategories && <p className="text-red-500 text-sm mt-2">{errors.applicableCategories}</p>}
              </div>
            )}

            {offerData.offerType === 'item' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Food Items *</label>
                <div className="max-h-64 overflow-y-auto space-y-2 bg-white rounded-xl p-4 border-2 border-gray-200">
                  {foodItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleFoodItem(item.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        offerData.applicableFoodItems.includes(item.id)
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.category} • ₹{item.price}</p>
                        </div>
                        {offerData.applicableFoodItems.includes(item.id) && (
                          <CheckCircle size={20} className="text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.applicableFoodItems && <p className="text-red-500 text-sm mt-2">{errors.applicableFoodItems}</p>}
              </div>
            )}
          </div>

          {/* Duration & Limits */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="text-orange-600" size={20} />
              Duration & Usage Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                <input
                  type="datetime-local"
                  value={offerData.startDate}
                  onChange={(e) => setOfferData({ ...offerData, startDate: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.startDate ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  value={offerData.endDate}
                  onChange={(e) => setOfferData({ ...offerData, endDate: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.endDate ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Usage Limit</label>
                <input
                  type="number"
                  value={offerData.usageLimit}
                  onChange={(e) => setOfferData({ ...offerData, usageLimit: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="100 (leave empty for unlimited)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Per Customer</label>
                <input
                  type="number"
                  value={offerData.usagePerCustomer}
                  onChange={(e) => setOfferData({ ...offerData, usagePerCustomer: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${offerData.isActive ? 'bg-green-100' : 'bg-gray-200'}`}>
                {offerData.isActive ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <AlertCircle className="text-gray-600" size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">Offer Status</p>
                <p className="text-sm text-gray-600">
                  {offerData.isActive ? 'Active and visible to customers' : 'Inactive and hidden'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOfferData({ ...offerData, isActive: !offerData.isActive })}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                offerData.isActive
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {offerData.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              {editingOffer ? 'Update Offer' : 'Create Offer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Offers Page Component
export default function Offers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      name: 'Weekend Special',
      description: 'Get 20% off on all orders above ₹500',
      discountType: 'percentage',
      discountValue: 20,
      offerType: 'category',
      applicableCategories: ['Main Course', 'Starters'],
      applicableFoodItems: [],
      minOrderValue: 500,
      maxDiscount: 200,
      startDate: '2025-10-20T00:00',
      endDate: '2025-10-27T23:59',
      isActive: true,
      usageLimit: 100,
      usagePerCustomer: 1,
      usedCount: 45
    },
    {
      id: 2,
      name: 'Dessert Delight',
      description: 'Flat ₹50 off on desserts',
      discountType: 'fixed',
      discountValue: 50,
      offerType: 'category',
      applicableCategories: ['Desserts'],
      applicableFoodItems: [],
      minOrderValue: 0,
      maxDiscount: 50,
      startDate: '2025-10-15T00:00',
      endDate: '2025-11-15T23:59',
      isActive: true,
      usageLimit: 200,
      usagePerCustomer: 2,
      usedCount: 78
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Breads'];
  const foodItems = [
    { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 280 },
    { id: 2, name: 'Butter Chicken', category: 'Main Course', price: 350 },
    { id: 3, name: 'Gulab Jamun', category: 'Desserts', price: 80 },
    { id: 4, name: 'Dal Makhani', category: 'Main Course', price: 260 },
    { id: 5, name: 'Garlic Naan', category: 'Breads', price: 45 },
    { id: 6, name: 'Mango Lassi', category: 'Beverages', price: 90 }
  ];

  const handleCreateOffer = () => {
    setEditingOffer(null);
    setIsModalOpen(true);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setIsModalOpen(true);
  };

  const handleSaveOffer = (offerData) => {
    if (editingOffer) {
      setOffers(offers.map(o => o.id === editingOffer.id ? { ...offerData, id: editingOffer.id, usedCount: editingOffer.usedCount } : o));
    } else {
      setOffers([...offers, { ...offerData, id: Date.now(), usedCount: 0 }]);
    }
  };

  const handleDeleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  const toggleOfferStatus = (id) => {
    setOffers(offers.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o));
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && offer.isActive) ||
                         (filterStatus === 'inactive' && !offer.isActive);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: offers.length,
    active: offers.filter(o => o.isActive).length,
    totalUsage: offers.reduce((sum, o) => sum + (o.usedCount || 0), 0),
    avgDiscount: offers.reduce((sum, o) => sum + (o.discountType === 'percentage' ? o.discountValue : 0), 0) / offers.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Gift size={24} />
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-purple-100">Total Offers</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} />
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.active}</p>
          <p className="text-green-100">Active Offers</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} />
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.totalUsage}</p>
          <p className="text-blue-100">Total Redemptions</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Percent size={24} />
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.avgDiscount.toFixed(1)}%</p>
          <p className="text-orange-100">Avg Discount</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Tag size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Offers Management</h2>
              <p className="text-gray-600">Create and manage special offers for your customers</p>
            </div>
          </div>
          <button
            onClick={handleCreateOffer}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Offer
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Offers</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <Gift size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No offers found</p>
              <button
                onClick={handleCreateOffer}
                className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
              >
                Create Your First Offer
              </button>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Section - Offer Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${offer.isActive ? 'from-purple-500 to-pink-500' : 'from-gray-400 to-gray-500'} text-white shadow-md`}>
                          <Gift size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{offer.name}</h3>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              offer.isActive 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}>
                              {offer.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{offer.description}</p>
                          
                          {/* Discount Badge */}
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-xl font-bold shadow-md">
                            <Percent size={16} />
                            {offer.discountType === 'percentage' 
                              ? `${offer.discountValue}% OFF` 
                              : `₹${offer.discountValue} OFF`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Offer Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Applies To</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {offer.offerType === 'category' ? 'Categories' : 'Items'}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Min Order</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {offer.minOrderValue ? `₹${offer.minOrderValue}` : 'No Min'}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Max Discount</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {offer.maxDiscount ? `₹${offer.maxDiscount}` : 'Unlimited'}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Usage</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {offer.usedCount}/{offer.usageLimit || '∞'}
                        </p>
                      </div>
                    </div>

                    {/* Applicable Items/Categories */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {offer.offerType === 'category' ? 'Applicable Categories:' : 'Applicable Items:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {offer.offerType === 'category' ? (
                          offer.applicableCategories.map((cat, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-sm font-medium">
                              {cat}
                            </span>
                          ))
                        ) : (
                          offer.applicableFoodItems.map((itemId, idx) => {
                            const item = foodItems.find(f => f.id === itemId);
                            return item ? (
                              <span key={idx} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-sm font-medium">
                                {item.name}
                              </span>
                            ) : null;
                          })
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span>
                          {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-green-600" />
                        <span>
                          {Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex lg:flex-col gap-3 lg:w-40">
                    <button
                      onClick={() => toggleOfferStatus(offer.id)}
                      className={`flex-1 lg:flex-none px-4 py-3 rounded-xl font-semibold transition-all ${
                        offer.isActive
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {offer.isActive ? 'Active' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEditOffer(offer)}
                      className="flex-1 lg:flex-none px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="flex-1 lg:flex-none px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Usage Progress Bar */}
                {offer.usageLimit && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Usage Progress</span>
                      <span className="text-sm font-bold text-gray-800">
                        {((offer.usedCount / offer.usageLimit) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((offer.usedCount / offer.usageLimit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOffer(null);
        }}
        onSave={handleSaveOffer}
        editingOffer={editingOffer}
        categories={categories}
        foodItems={foodItems}
      />
    </div>
  );
}