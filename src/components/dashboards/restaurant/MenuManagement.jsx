import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Camera, CheckCircle, ChefHat, Clock, DollarSign, Edit2, Eye, Grid, Leaf, List, Plus, Search, Tag, Trash2, X } from "lucide-react";
import { BiDish, BiSolidDish } from "react-icons/bi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addFoodItem, addMenuCategory, deleteFoodItem, getRestaurantProfile, updateFoodItem } from "../../../api/restaurantApi";
import useAuthStore from "../../../store/useAuthStore";
import { FaTimes } from "react-icons/fa";

const MenuManagement = () => {
    const queryClient = useQueryClient();
    const { user, setUser } = useAuthStore();

    const categories = user.profile.menu || [];
    const foodItems = user.profile.foodItems;

    const addMenuCategoryMutation = useMutation({
        mutationFn: addMenuCategory,
        onSuccess: async () => {
            toast.success("Menu Category added successfully!");
            setShowAddModal(false);
            setUser(await getRestaurantProfile(), "Restaurant");
            queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const addFoodItemMutation = useMutation({
        mutationFn: addFoodItem,
        onSuccess: async () => {
            toast.success("Food Item added successfully");
            setShowAddModal(false);
            setUser(await getRestaurantProfile(), "Restaurant");
            queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const updateFoodItemMutation = useMutation({
        mutationFn: updateFoodItem,
        onSuccess: async (data) => {
            toast.success(data.message);
            setShowEditModal(false);
            setUser(await getRestaurantProfile(), "Restaurant");
            queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    })

    const deleteFoodItemMutation = useMutation({
        mutationFn: deleteFoodItem,
        onSuccess: async (data) => {
            toast.success(data.message);
            setUser(await getRestaurantProfile(),"Restaurant");
            await queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
        },
        onError: (error) => {
            toast.error(error.response.data?.message || "Something went wrong");
        }
    });

    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
    const [tagsInput, setTagsInput] = useState("");
    const [foodItemForm, setFoodItemForm] = useState({
        restaurantName: user.profile.restaurantName,
        category_name: "",
        name: "",
        description: "",
        images: [],
        price: "",
        discount_price: "",
        isAvailable: true,
        preparationTime: 15,
        isVeg: true,
        tags: [],
        variants: [],
    });
    const [updateFoodItemForm, setUpdateFoodItemForm] = useState({
        restaurantName: user.profile.restaurantName,
        category_name: "",
        name: "",
        description: "",
        images: [],
        price: "",
        discount_price: "",
        isAvailable: true,
        preparationTime: 15,
        isVeg: true,
        tags: [],
        variants: [],
    });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [menuView, setMenuView] = useState('grid');
    const [modalType, setModalType] = useState('item'); // 'item' or 'category'
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState(null);

    const handleViewDetails = (foodItem) => {
        setSelectedFoodItem(foodItem);
        setShowDetailsModal(true);
    };

    const handleEditItem = (foodItem) => {
        setSelectedFoodItem(foodItem);
        setShowEditModal(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleFoodItemChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "tags") {
            setTagsInput(value);
            return;
        }

        setFoodItemForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };
    const addTag = () => {
        if(tagsInput.trim() && !foodItemForm.tags.includes(tagsInput.trim())){
            setFoodItemForm(prev => ({
                ...prev,
                tags: [...prev.tags, tagsInput.trim()]
            }));
            setTagsInput('');
        }
    };
    const removeTag = (tag) => {
        setFoodItemForm(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t != tag)
        }))
    }
    const handleTagsKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleUpdateFoodItemChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "tags") {
            setTagsInput(value);
            return;
        }

        setUpdateFoodItemForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleUpdateFoodItemImageChange = (e) => {
        const files = Array.from(e.target.files);
        setUpdateFoodItemForm(prev => ({
            ...prev,
            images: files
        }));
    };

    const addUpdateTag = () => {
        if(tagsInput.trim() && !updateFoodItemForm.tags.includes(tagsInput.trim())){
            setUpdateFoodItemForm(prev => ({
                ...prev,
                tags: [...prev.tags, tagsInput.trim()]
            }));
            setTagsInput('');
        }
    };

    const removeUpdateFormTag = (tag) => {
        setUpdateFoodItemForm(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t != tag)
        }))
    }

    const handleUpdateTagsKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addUpdateTag();
        }
    };

    const removeImage = (indexToRemove) => {
        setUpdateFoodItemForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };
    
    const handleFoodItemImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setFoodItemForm(prev => ({
            ...prev,
            images: files
        }));
    };

    const filteredItems = foodItems?.filter(item => {
        const categoryName = item.category_id?.name?.toLowerCase() || "";
        const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase()) || categoryName.includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category_id.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const validateFoodItem = (form) => {
        if (!form.name.trim()) return "Item name is required";
        if (!form.category_name) return "Please select a category";
        if (!form.price || form.price <= 0) return "Please enter a valid price";
        if (form.discount_price && form.discount_price >= form.price) 
            return "Discount price must be less than regular price";
        if (!form.description.trim()) return "Description is required";
        if (form.preparationTime <= 0) return "Please enter a valid preparation time";
        return null;
    };

    const validateCategory = (form) => {
        if (!form.name.trim()) return "Category name is required";
        return null;
    };

    const handleAddFoodItem = () => {
        const error = validateFoodItem(foodItemForm);
        if (error) {
            toast.error(error);
            return;
        }

        console.log(foodItemForm);
        addFoodItemMutation.mutate({ formData: foodItemForm });
        setFoodItemForm({
            restaurantName: user.profile.restaurantName,
            category_name: "",
            name: "",
            description: "",
            images: [],
            price: "",
            discount_price: "",
            isAvailable: true,
            preparationTime: 15,
            isVeg: true,
            tags: [],
            variants: [],
        })
    };

    const handleUpdateFoodItem = (e) => {
        e.preventDefault();
        const error = validateFoodItem(updateFoodItemForm);
        if (error) {
            toast.error(error);
            return;
        }
        
        console.log(updateFoodItemForm)
        updateFoodItemMutation.mutate({ formData: updateFoodItemForm, foodItemId: selectedFoodItem._id });
    }

    const handleDeleteItem = (foodItemId) => {
        deleteFoodItemMutation.mutate(foodItemId);
    }

    const handleAddCategory = () => {
        const error = validateCategory(categoryForm);
        if (error) {
            toast.error(error);
            return;
        }
        addMenuCategoryMutation.mutate(categoryForm);
    };

    useEffect(() => {
        if (foodItemForm.tags.length > 0) {
            setTagsInput(foodItemForm.tags.join(', '));
        }
    }, []);

    useEffect(() => {
      if (showEditModal && selectedFoodItem) {
        setUpdateFoodItemForm({
          restaurantName: user.profile.restaurantName,
          name: selectedFoodItem.name || "",
          category_name: selectedFoodItem.category_name || "",
          description: selectedFoodItem.description || "",
          price: selectedFoodItem.price || "",
          discount_price: selectedFoodItem.discount_price || "",
          preparationTime: selectedFoodItem.preparationTime || "",
          isVeg: selectedFoodItem.isVeg || false,
          isAvailable: selectedFoodItem.isAvailable ?? true,
          tags: selectedFoodItem.tags || [],
          images: selectedFoodItem.images || [],
          variants: selectedFoodItem.variants || []
        });
      }
    }, [showEditModal, selectedFoodItem]);

    return (
        <div className="grid grid-cols-4 gap-5">
            <div className="col-span-3 space-y-6">
            {/* Menu Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
                        <p className="text-gray-600">Manage your restaurant's menu items and categories</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setModalType('category'); setShowAddModal(true); }}
                            className="px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Category
                        </button>
                        <button
                            onClick={() => { setModalType('item'); setShowAddModal(true); }}
                            className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => setMenuView('grid')}
                            className={`p-3 cursor-pointer ${menuView === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setMenuView('list')}
                            className={`p-3 cursor-pointer ${menuView === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                {menuView === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => {
                            // Get the first image or a placeholder
                            const src =
                              item.images && item.images.length > 0
                                ? `${import.meta.env.VITE_BACKEND_URL}${item.images[0]}`
                                : "";
                        
                            return (
                              <div
                                key={item._id}
                                className="bg-gray-50 min-h-[35vh] cursor-pointer rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                              >
                                <div className="relative">
                                  <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        {src ? (
                                            <img
                                                src={src}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="text-gray-400 flex items-center justify-center w-full h-full">
                                                <BiSolidDish size={78} />
                                            </div>
                                        )}
                                  </div>
                            
                                  {/* Availability badge */}
                                  <div className="absolute top-3 right-3">
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        item.isAvailable
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {item.isAvailable ? "Available" : "Out of Stock"}
                                    </span>
                                  </div>
                                  
                                  {/* Hover actions */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleViewDetails(item)}
                                        className="p-2 cursor-pointer bg-white rounded-lg shadow-lg hover:bg-gray-50"
                                      >
                                        <Eye size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleEditItem(item)}
                                        className="p-2 cursor-pointer bg-white rounded-lg shadow-lg hover:bg-gray-50"
                                      >
                                        <Edit2 size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(item._id)}
                                        className="p-2 cursor-pointer bg-white rounded-lg shadow-lg hover:bg-red-200 text-red-600"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                  
                                {/* Card content */}
                                <div className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                                    <span className="font-bold text-orange-600">₹{item.price}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                      {item.category_id?.name}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.orders || 0} orders</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-3 flex flex-col items-center justify-center min-h-[35vh] bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center space-y-4">
                                <Box className="h-16 w-16 text-gray-300" />
                                <h3 className="text-xl font-semibold text-gray-700">
                                    No items available
                                </h3>
                                <p className="text-gray-500">
                                    There are currently no items in{" "}
                                    <span className="font-medium text-orange-500">{selectedCategory}</span>.
                                    Please check back later or add new items.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredItems?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                                        <ChefHat size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {item.isAvailable ? 'Available' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                                {item.category_id.name}
                                            </span>
                                            <span className="text-sm text-gray-500">{item.orders} orders</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-orange-600 text-lg">₹{item.price}</span>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit FoodItem/Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-200">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden transform transition-all duration-200 scale-100 opacity-100">
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Add New {modalType === 'item' ? 'Menu Item' : 'Category'}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Fill in the details below to add a new {modalType === 'item' ? 'menu item' : 'category'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <X size={20} className="cursor-pointer" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {modalType === 'item' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 bg-orange-50 border border-orange-200 rounded-xl p-4">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-24 h-24 bg-white rounded-lg border-2 border-dashed border-orange-300 flex items-center justify-center">
                                                {foodItemForm.images.length > 0 ? (
                                                    <img 
                                                        src={URL.createObjectURL(foodItemForm.images[0])} 
                                                        alt="Preview" 
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <ChefHat size={24} className="text-orange-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800">Item Images</h3>
                                                <p className="text-sm text-gray-600 mb-2">Add up to 5 images of your item</p>
                                                <input
                                                    type="file"
                                                    name="images"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleFoodItemImagesChange}
                                                    className="block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-orange-50 file:text-orange-700
                                                        hover:file:bg-orange-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Item Name*</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={foodItemForm.name}
                                            onChange={handleFoodItemChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="e.g., Chicken Tikka Masala"
                                        />
                                    </div>
                                                
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            name="category_name"
                                            value={foodItemForm.category_name}
                                            onChange={handleFoodItemChange}
                                            disabled={categories.length === 0}
                                            className="w-full px-4 py-2 border cursor-pointer border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category._id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                            
                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={foodItemForm.price}
                                            onChange={handleFoodItemChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Enter price"
                                        />
                                    </div>
                                            
                                    {/* Discount Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price</label>
                                        <input
                                            type="number"
                                            name="discount_price"
                                            value={foodItemForm.discount_price}
                                            onChange={handleFoodItemChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Enter discount price (optional)"
                                        />
                                    </div>
                                            
                                    {/* Preparation Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (mins)</label>
                                        <input
                                            type="number"
                                            name="preparationTime"
                                            value={foodItemForm.preparationTime}
                                            onChange={handleFoodItemChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Enter preparation time"
                                        />
                                    </div>
                                            
                                    {/* Veg / Non-Veg */}
                                    <div className="flex items-center mt-6 md:mt-0">
                                        <input
                                            type="checkbox"
                                            name="isVeg"
                                            checked={foodItemForm.isVeg}
                                            onChange={handleFoodItemChange}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">Vegetarian</label>
                                    </div>
                                            
                                    {/* Availability */}
                                    <div className="flex items-center mt-6 md:mt-0">
                                        <input
                                            type="checkbox"
                                            name="isAvailable"
                                            checked={foodItemForm.isAvailable}
                                            onChange={handleFoodItemChange}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">Available for orders</label>
                                    </div>
                                            
                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={foodItemForm.description}
                                            onChange={handleFoodItemChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            rows={3}
                                            placeholder="Enter item description"
                                        />
                                    </div>
                                            
                                    {/* Tags */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={tagsInput}
                                            onChange={handleFoodItemChange}
                                            onBlur={addTag} // Process when user clicks away
                                            onKeyDown={handleTagsKeyDown} // Process when user presses Enter
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="e.g., spicy, vegan, gluten-free"
                                        />
                                        {foodItemForm.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {foodItemForm.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-orange-100 flex items-center gap-1 text-orange-800 px-2 py-1 rounded-md text-sm"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(tag)}
                                                            className="text-orange-500 cursor-pointer hover:text-orange-700 transition-colors duration-200"
                                                        >
                                                            <FaTimes className="text-xs" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2 flex gap-4 mt-2">
                                        <button
                                            onClick={handleAddFoodItem}
                                            className="flex-1 cursor-pointer bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 
                                                transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} />
                                            Add Item
                                        </button>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 cursor-pointer border border-gray-300 text-gray-700 py-3 rounded-xl 
                                                hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Category form with similar styling
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                                        <input
                                          type="text"
                                          name="name"
                                          value={categoryForm.name}
                                          onChange={handleChange}
                                          placeholder={categories.length === 0 ? "Add Categories" : "Enter category name"}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={categoryForm.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            rows={3}
                                            placeholder="Enter category description"
                                        />
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        <button
                                            onClick={handleAddCategory}
                                            className="flex-1 cursor-pointer bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 
                                                transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} className={`${addMenuCategoryMutation.isPending ? "hidden" : ""}`} />
                                            {addMenuCategoryMutation.isPending ? "Processing..." : "Add Category"}
                                        </button>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 cursor-pointer border border-gray-300 text-gray-700 py-3 rounded-xl 
                                                hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Food Item Details Modal */}
            {showDetailsModal && selectedFoodItem && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
            
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-extrabold text-gray-800">{selectedFoodItem.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{selectedFoodItem.category_id.name}</p>
                    </div>
            
                    <div className="flex items-center gap-4">
                      <span className="bg-orange-100 text-orange-600 font-semibold text-xl px-5 py-2 rounded-full shadow-sm">
                        ₹{" "}{selectedFoodItem.price}
                      </span>
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="p-3 bg-white rounded-full shadow hover:shadow-md text-gray-400 hover:text-orange-500 transition"
                      >
                        <X size={22} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
            
                  {/* Body */}
                  <div className="p-8 max-h-[calc(100vh-220px)] overflow-y-auto flex flex-col lg:flex-row gap-8">
            
                    {/* Left - Image Section */}
                    <div className="lg:w-1/2 space-y-4">
                      {/* Hero Image */}
                      <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
                        {selectedFoodItem.images?.[0] ? (
                          <img
                            src={import.meta.env.VITE_BACKEND_URL + selectedFoodItem.images[0]}
                            alt={selectedFoodItem.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-gray-400">
                            <BiDish size={64} />
                          </div>
                        )}
                      </div>
                    
                      {/* Thumbnails */}
                      <div className="grid grid-cols-3 gap-3">
                        {selectedFoodItem.images?.slice(1, 4).map((img, idx) => (
                          <div key={idx} className="h-24 bg-gray-100 rounded-xl overflow-hidden shadow flex items-center justify-center">
                            <img
                              src={import.meta.env.VITE_BACKEND_URL + img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Right - Details */}
                    <div className="lg:w-1/2 flex flex-col gap-6">
                    
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            <Clock size={16} /> Prep Time
                          </h3>
                          <p className="text-gray-800 text-lg mt-1">{selectedFoodItem.preparationTime} mins</p>
                        </div>
                        {selectedFoodItem.discount_price && (
                          <div className="p-4 bg-green-50 rounded-xl shadow-sm">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                              <Tag size={16} /> Discount
                            </h3>
                            <p className="text-green-600 text-lg font-bold mt-1">₹{selectedFoodItem.discount_price}</p>
                          </div>
                        )}
                        <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            <Leaf size={16} /> Vegetarian
                          </h3>
                          <p className="text-gray-800 text-lg mt-1">{selectedFoodItem.isVeg ? "Yes" : "No"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            <CheckCircle size={16} /> Available
                          </h3>
                          <p className="text-gray-800 text-lg mt-1">{selectedFoodItem.isAvailable ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    
                      {/* Description */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{selectedFoodItem.description || "No description provided for this item."}</p>
                      </div>
                    
                      {/* Tags */}
                      {selectedFoodItem.tags?.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedFoodItem.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 text-sm px-4 py-1.5 rounded-full font-medium shadow-sm hover:shadow transition"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 shadow-md transition"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Update FoodItem Modal */}
            {showEditModal && selectedFoodItem && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
                <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100">

                  {/* Header with a warm gradient */}
                  <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-extrabold text-orange-600 tracking-tight">Update Food Item</h2>
                      <p className="text-sm text-gray-500 mt-2">Enter the details for the updated food item</p>
                    </div>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="p-3 bg-white cursor-pointer rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
                    >
                      <X size={24} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Form Body with clear, grouped sections */}
                  <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto space-y-8">
                    <form onSubmit={handleUpdateFoodItem} className="space-y-8">

                      {/* Section 1: Core Details */}
                      <div className="space-y-6 bg-gray-50 p-6 rounded-2xl shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                          <Leaf size={20} className="text-orange-500" /> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-600">Food Item Name</label>
                            <input
                              type="text"
                              onChange={handleUpdateFoodItemChange}
                              value={updateFoodItemForm.name}
                              name="name"
                              placeholder="e.g., Spicy Paneer Masala"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none focus:border-orange-500 transition-all duration-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium text-gray-600">Category</label>
                            <select
                              onChange={handleUpdateFoodItemChange}
                              value={updateFoodItemForm.category_name}
                              name="category_name"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none focus:border-orange-500 transition-all duration-200"
                            >
                              <option value="">Select a category</option>
                              {/* Map through your categories here */}
                              {categories.map(cat => (
                                <option key={cat._id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="description" className="text-sm font-medium text-gray-600">Description</label>
                          <textarea
                            onChange={handleUpdateFoodItemChange}
                            value={updateFoodItemForm.description}
                            name="description"
                            placeholder="A brief description of the food item..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none focus:border-orange-500 transition-all duration-200"
                          ></textarea>
                        </div>
                      </div>
                          
                      {/* Section 2: Pricing & Time */}
                      <div className="space-y-6 bg-gray-50 p-6 rounded-2xl shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                          <DollarSign size={20} className="text-orange-500" /> Pricing & Time
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium text-gray-600">Price (₹)</label>
                            <input
                              type="text"
                              onChange={handleUpdateFoodItemChange}
                              value={updateFoodItemForm.price}
                              name="price"
                              placeholder="e.g., 250"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none focus:border-orange-500 transition-all duration-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="discount_price" className="text-sm font-medium text-gray-600">Discount Price (₹)</label>
                            <input
                              type="text"
                              onChange={handleUpdateFoodItemChange}
                              name="discount_price"
                              value={updateFoodItemForm.discount_price}
                              placeholder="e.g., 200 (optional)"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none focus:border-orange-500 transition-all duration-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="prepTime" className="text-sm font-medium text-gray-600">Preparation Time (mins)</label>
                            <input
                              type="number"
                              onChange={handleUpdateFoodItemChange}
                              value={updateFoodItemForm.preparationTime}
                              name="preparationTime"
                              placeholder="e.g., 25"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none focus:border-orange-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-6 pt-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="isVeg"
                              onChange={handleUpdateFoodItemChange}
                              value={updateFoodItemForm.isVeg}
                              className="form-checkbox h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                            />
                            <span className="text-gray-700">Vegetarian</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="isAvailable"
                              defaultChecked
                              onChange={handleUpdateFoodItemChange}
                              value={updateFoodItemForm.isAvailable}
                              className="form-checkbox h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                            />
                            <span className="text-gray-700">Available</span>
                          </label>
                        </div>
                      </div>
                          
                      {/* Section 3: Tags & Images */}
                      <div className="space-y-6 bg-gray-50 p-6 rounded-2xl shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                          <Camera size={20} className="text-orange-500" /> Images & Tags
                        </h3>
                        <div className="space-y-2">
                          <label htmlFor="tags" className="text-sm font-medium text-gray-600">Tags</label>
                          <input
                              type="text"
                              name="tags"
                              value={tagsInput}
                              onChange={handleUpdateFoodItemChange}
                              onBlur={addUpdateTag} // Process when user clicks away
                              onKeyDown={handleUpdateTagsKeyDown} // Process when user presses Enter
                              className="w-full px-4 py-2 border mt-1 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="e.g., spicy, vegan, gluten-free"
                          />
                          {updateFoodItemForm.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                  {updateFoodItemForm.tags.map((tag, index) => (
                                      <span
                                          key={index}
                                          className="bg-orange-100 flex items-center gap-1 text-orange-800 px-2 py-1 rounded-md text-sm"
                                      >
                                          {tag}
                                          <button
                                              type="button"
                                              onClick={() => removeUpdateFormTag(tag)}
                                              className="text-orange-500 cursor-pointer hover:text-orange-700 transition-colors duration-200"
                                          >
                                              <FaTimes className="text-xs" />
                                          </button>
                                      </span>
                                  ))}
                              </div>
                          )}
                        </div>
                          
                        {/* Image Preview Grid (conceptual) */}
                        {updateFoodItemForm.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {updateFoodItemForm.images.map((img, index) => {
                                    // If the image is a file object (newly uploaded), create a preview URL
                                    const src = typeof img === "string" 
                                    ? `${import.meta.env.VITE_BACKEND_URL}${img}` // Existing images from backend
                                    : URL.createObjectURL(img); // Newly selected local files
                                    console.log(src);
                                    
                                    return (
                                        <div key={index} className="relative w-full h-fit bg-gray-100 rounded-lg overflow-hidden group">
                                            <img
                                                src={src}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors"
                                                >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* Image upload area with a clear call-to-action */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Upload Images</label>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera size={40} className="text-gray-400 mb-2" />
                                <p className="mb-2 text-sm text-gray-500 text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 text-center">PNG, JPG, or GIF</p>
                              </div>
                              <input onChange={handleUpdateFoodItemImageChange} name="images" id="dropzone-file" type="file" className="hidden" multiple />
                            </label>
                          </div>
                        </div>
                      </div>
                    
                      {/* Footer with action buttons */}
                      <div className="flex justify-end gap-4 mt-8">
                        <button
                          type="button"
                          onClick={() => setShowEditModal(false)}
                          className="px-8 py-4 cursor-pointer text-gray-600 bg-gray-100 rounded-2xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          onClick={handleUpdateFoodItem}
                          className="px-8 py-4 cursor-pointer bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-md"
                        >
                          Update Item
                        </button>
                      </div>
                    </form>
                  </div>
                    
                </div>
              </div>
            )}
            </div>

            {/* Menu Categories */}
            <div className="col-span-1 h-fit w-md bg-white border border-gray-200 p-6 shadow-sm rounded-2xl flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Menu Categories</h3>

                <div className="flex-1 overflow-y-auto">
                    {categories.length > 0 ? (
                        <ul className="space-y-3">
                            <li
                                onClick={() => setSelectedCategory('all')}
                                className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer transition-colors
                                  ${selectedCategory === 'all' ? 'bg-orange-100 border-orange-300' : 'bg-gray-50 hover:bg-orange-50'}
                                `}
                            >
                                <span className="text-gray-700 font-medium">All Items</span>
                            </li>
                            {categories.map((cat) => (
                                <li
                                    onClick={() => setSelectedCategory(cat.name)}
                                    key={cat._id}
                                    className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer transition-colors
                                      ${selectedCategory === cat.name ? 'bg-orange-100 border-orange-300' : 'bg-gray-50 hover:bg-orange-50'}
                                    `}
                                >
                                    <span className="text-gray-700 font-medium">{cat.name}</span>
                                    <span className="text-gray-400 text-sm">{cat.items.length || 0} items</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No categories added yet. Add some to get started!</p>
                    )}
                </div>
                
                <button
                    onClick={() => {setShowAddModal(true); setModalType('category')}}// function to open modal or form
                    className="mt-6 w-full py-3 bg-orange-500 cursor-pointer text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>
        </div>
    );
};

export default MenuManagement;