import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Camera, CheckCircle, ChefHat, Clock, DollarSign, Edit2, Eye, Grid, Layers, Leaf, List, Plus, Search, Tag, Trash2, X } from "lucide-react";
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
    const addVariant = () => {
        setFoodItemForm(prev => ({
            ...prev,
            variants: [...prev.variants, {
                name: '',
                price: 0,
                quantity: '',
                calories: 0,
                addons: [],
                isAvailable: true
            }]
        }));
    };
    const removeVariant = (index) => {
        setFoodItemForm(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };
    const updateVariant = (index, field, value) => {
        setFoodItemForm(prev => ({
            ...prev,
            variants: prev.variants.map((variant, i) => 
                i === index ? { ...variant, [field]: value } : variant
            )
        }));
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

    const removeUpdateImage = (indexToRemove) => {
        setUpdateFoodItemForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };
    
    const handleFoodItemImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setFoodItemForm(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
        console.log(foodItemForm);
    };
    const removeImage = (index) => {
        setFoodItemForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
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
                                <div className="p-4 flex flex-col">
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                                    <span className="font-bold text-orange-600">₹{item.price}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 overflow-x-hidden max-h-9 overflow-y-hidden w-full mb-2">{item.description}</p>
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
                    <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100 max-h-[95vh] overflow-y-auto">
                        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">
                                        Add New {modalType === 'item' ? 'Menu Item' : 'Category'}
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        Fill in all the details below to create a {modalType === 'item' ? 'comprehensive menu item' : 'new category'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="w-12 h-12 hover:bg-gray-200 rounded-xl transition-colors duration-300 flex items-center justify-center group"
                                >
                                    <X size={24} className="cursor-pointer text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                                </button>
                            </div>
                        </div>
            
                        <div className="p-8">
                            {modalType === 'item' ? (
                                <div className="space-y-8">
                                    {/* Image Upload Section */}
                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-2xl p-6">
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Food Item Images</h3>
                                            <p className="text-gray-600">Upload up to 5 high-quality images of your dish</p>
                                        </div>

                                        <div className="flex flex-wrap gap-4 justify-center mb-6">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <div key={index} className="relative">
                                                    <div className="w-24 h-24 bg-white rounded-xl border-2 border-dashed border-orange-300 flex items-center justify-center hover:border-orange-400 transition-colors duration-300 group">
                                                        {foodItemForm.images[index] ? (
                                                            <img 
                                                                src={URL.createObjectURL(foodItemForm.images[index])} 
                                                                alt={`Preview ${index + 1}`} 
                                                                className="w-full h-full object-cover rounded-xl"
                                                            />
                                                        ) : (
                                                            <ChefHat size={24} className="text-orange-300 group-hover:text-orange-400 transition-colors duration-300" />
                                                        )}
                                                    </div>
                                                    {foodItemForm.images[index] && (
                                                        <button 
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <input
                                            type="file"
                                            name="images"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFoodItemImagesChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-3 file:px-6
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-orange-100 file:text-orange-700
                                                hover:file:bg-orange-200 file:transition-colors file:duration-300"
                                        />
                                    </div>
                                        
                                    {/* Basic Information */}
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                                                <ChefHat size={18} className="text-white" />
                                            </div>
                                            Basic Information
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">Item Name*</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={foodItemForm.name}
                                                    onChange={handleFoodItemChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                                    placeholder="e.g., Chicken Tikka Masala"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">Category*</label>
                                                <select
                                                    name="category_name"
                                                    value={foodItemForm.category_name}
                                                    onChange={handleFoodItemChange}
                                                    disabled={categories.length === 0}
                                                    className="w-full px-4 py-3 border cursor-pointer border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(category => (
                                                        <option key={category._id} value={category.name}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                                
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                                                <textarea
                                                    name="description"
                                                    value={foodItemForm.description}
                                                    onChange={handleFoodItemChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                                    rows={4}
                                                    placeholder="Describe your dish in detail - ingredients, cooking style, taste profile..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                                
                                    {/* Pricing & Details */}
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                                <DollarSign size={18} className="text-white" />
                                            </div>
                                            Pricing & Details
                                        </h3>
                                                
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">Base Price*</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={foodItemForm.price}
                                                        onChange={handleFoodItemChange}
                                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                                        placeholder="199"
                                                    />
                                                </div>
                                            </div>
                                                
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">Discount Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                                    <input
                                                        type="number"
                                                        name="discount_price"
                                                        value={foodItemForm.discount_price}
                                                        onChange={handleFoodItemChange}
                                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                                        placeholder="149 (optional)"
                                                    />
                                                </div>
                                            </div>
                                                
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">Prep Time (mins)*</label>
                                                <input
                                                    type="number"
                                                    name="preparationTime"
                                                    value={foodItemForm.preparationTime}
                                                    onChange={handleFoodItemChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                                    placeholder="15"
                                                />
                                            </div>
                                        </div>
                                                
                                        <div className="grid grid-cols-2 gap-6 mt-6">
                                            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                                <input
                                                    type="checkbox"
                                                    name="isVeg"
                                                    checked={foodItemForm.isVeg}
                                                    onChange={handleFoodItemChange}
                                                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-800">Vegetarian Item</label>
                                                    <p className="text-xs text-gray-600">Mark if this item is vegetarian</p>
                                                </div>
                                            </div>
                                                
                                            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                <input
                                                    type="checkbox"
                                                    name="isAvailable"
                                                    checked={foodItemForm.isAvailable}
                                                    onChange={handleFoodItemChange}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-800">Available for Orders</label>
                                                    <p className="text-xs text-gray-600">Customers can order this item</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                                
                                    {/* Tags Section */}
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                                                <Tag size={18} className="text-white" />
                                            </div>
                                            Tags & Labels
                                        </h3>
                                                
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Item Tags (Press Enter or comma to add)
                                            </label>
                                            <input
                                                type="text"
                                                name="tags"
                                                value={tagsInput}
                                                onChange={handleFoodItemChange}
                                                onBlur={addTag}
                                                onKeyDown={handleTagsKeyDown}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                                placeholder="e.g., spicy, bestseller, healthy, gluten-free"
                                            />

                                            {foodItemForm.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-3 mt-4">
                                                    {foodItemForm.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 flex items-center gap-2 text-orange-800 px-3 py-2 rounded-full text-sm font-medium"
                                                        >
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag(tag)}
                                                                className="text-orange-600 cursor-pointer hover:text-orange-800 transition-colors duration-200"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                        
                                    {/* Variants Section */}
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                                    <Layers size={18} className="text-white" />
                                                </div>
                                                Size Variants & Options
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addVariant}
                                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Plus size={16} />
                                                <span>Add Variant</span>
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            {foodItemForm.variants.map((variant, index) => (
                                                <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-lg font-semibold text-gray-800">
                                                            Variant {index + 1}
                                                        </h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVariant(index)}
                                                            className="text-red-500 hover:text-red-700 transition-colors duration-300 p-2 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Variant Name*
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={variant.name}
                                                                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                                placeholder="e.g., Regular, Large"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Price*
                                                            </label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                                                                <input
                                                                    type="number"
                                                                    value={variant.price}
                                                                    onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                                    placeholder="199"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Quantity
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={variant.quantity}
                                                                onChange={(e) => updateVariant(index, 'quantity', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                                placeholder="e.g., 250ml, 6 pieces"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Calories
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={variant.calories}
                                                                onChange={(e) => updateVariant(index, 'calories', parseInt(e.target.value) || 0)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                                placeholder="320"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Add-ons (comma separated)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={variant.addons?.join(', ') || ''}
                                                                onChange={(e) => updateVariant(index, 'addons', e.target.value.split(',').map(addon => addon.trim()).filter(addon => addon))}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                                placeholder="e.g., Extra Cheese, Extra Spicy"
                                                            />
                                                        </div>

                                                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                            <input
                                                                type="checkbox"
                                                                checked={variant.isAvailable}
                                                                onChange={(e) => updateVariant(index, 'isAvailable', e.target.checked)}
                                                                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                            />
                                                            <div>
                                                                <label className="text-sm font-semibold text-gray-800">Available</label>
                                                                <p className="text-xs text-gray-600">This variant can be ordered</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {foodItemForm.variants.length === 0 && (
                                                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                    <Layers size={32} className="text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-600 mb-2">No variants added yet</p>
                                                    <p className="text-sm text-gray-500">Add size options like Regular, Large, or custom variants</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                        
                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={handleAddFoodItem}
                                            disabled={addFoodItemMutation.isPending}
                                            className="flex-1 cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {addFoodItemMutation.isPending ? (
                                                <>
                                                    <Loader className="animate-spin" size={20} />
                                                    Creating Item...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={20} />
                                                    Create Menu Item
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 cursor-pointer border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Category form remains the same
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
                                            className="flex-1 cursor-pointer bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} className={`${addMenuCategoryMutation.isPending ? "hidden" : ""}`} />
                                            {addMenuCategoryMutation.isPending ? "Processing..." : "Add Category"}
                                        </button>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 cursor-pointer border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
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
            <div className="col-span-1 h-fit w-sm bg-white border border-gray-200 p-6 shadow-sm rounded-2xl flex flex-col">
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