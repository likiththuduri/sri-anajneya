import React, { useEffect, useState, useRef } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, Search, RefreshCw, AlertCircle, CheckCircle2, Image, Layers } from 'lucide-react';
import { Product, Category } from '../types';
import { productsApi } from '../api/products';
import { categoriesApi } from '../api/categories';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { resolveImageUrl, DEFAULT_PRODUCT_FALLBACK } from '../utils/imageUrl';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Quick Image Replacement state
  const [replacingProductId, setReplacingProductId] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategoryId, setFormCategoryId] = useState<number>(1);
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<string>('0');
  const [formPackSize, setFormPackSize] = useState('');
  const [formStock, setFormStock] = useState<number>(0);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formBookingAvailable, setFormBookingAvailable] = useState(true);
  const [formBookingNotes, setFormBookingNotes] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productsApi.getAdminProducts(),
        categoriesApi.getAllCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      showToast(err?.message || 'Failed to load products from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategoryId(categories[0]?.id || 1);
    setFormDescription('');
    setFormPrice('');
    setFormPackSize('');
    setFormStock(50);
    setFormImageUrl('');
    setFormActive(true);
    setFormFeatured(false);
    setFormBookingAvailable(true);
    setFormBookingNotes('');
    setModalError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategoryId(p.categoryId);
    setFormDescription(p.description || '');
    setFormPrice(String(p.price));
    setFormPackSize(p.packSize);
    setFormStock(p.stock);
    setFormImageUrl(p.imageUrl);
    setFormActive(p.active);
    setFormFeatured(p.featured);
    setFormBookingAvailable(p.bookingAvailable !== false);
    setFormBookingNotes(p.bookingNotes || '');
    setModalError(null);
    setModalOpen(true);
  };

  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setModalError(null);

    try {
      showToast('Uploading image from device...', 'info');
      const res = await productsApi.uploadProductImage(file);
      if (res.url) {
        setFormImageUrl(res.url);
        showToast('Image uploaded and saved successfully!', 'success');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to upload image.';
      setModalError(msg);
      showToast(msg, 'error');
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formName.trim() || !formBrand.trim() || !formPackSize.trim()) {
      setModalError('Please fill in product name, brand, and pack size.');
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setModalError('Please enter a valid price greater than zero.');
      return;
    }

    if (!formImageUrl.trim()) {
      setModalError('Please upload a product image or provide an image URL.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Product> = {
        name: formName.trim(),
        brand: formBrand.trim(),
        categoryId: Number(formCategoryId),
        description: formDescription.trim(),
        price: priceNum,
        packSize: formPackSize.trim(),
        stock: Math.max(0, Number(formStock) || 0),
        imageUrl: formImageUrl.trim(),
        active: formActive,
        featured: formFeatured,
        bookingAvailable: formBookingAvailable,
        bookingNotes: formBookingNotes.trim(),
      };

      if (editingProduct) {
        await productsApi.updateProduct(editingProduct.id, payload);
        showToast(`Product "${formName}" updated successfully in MySQL!`, 'success');
      } else {
        await productsApi.createProduct(payload);
        showToast(`Product "${formName}" created and saved to MySQL!`, 'success');
      }

      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      setModalError(err?.message || 'Failed to save product in database.');
      showToast(err?.message || 'Product save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Direct 1-Click Image Replacement (Triggered per table row)
  const triggerRowImageUpload = (productId: number) => {
    setReplacingProductId(productId);
    fileInputRef.current?.click();
  };

  const handleRowFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const prodId = replacingProductId;
    if (!file || !prodId) return;

    try {
      showToast('Uploading new picture from device...', 'info');
      const uploadRes = await productsApi.uploadProductImage(file);

      if (!uploadRes.url) {
        throw new Error('Image upload did not return an image URL.');
      }

      // Save directly into MySQL database
      await productsApi.updateProductImage(prodId, uploadRes.url);

      showToast('Product picture updated in database! All devices will now see this image.', 'success');
      // Refresh state from database
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to replace product picture.', 'error');
    } finally {
      setReplacingProductId(null);
      if (e.target) e.target.value = '';
    }
  };

  // Quick Stock Adjustment
  const handleStockChange = async (productId: number, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await productsApi.updateStock(productId, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
    } catch (err: any) {
      showToast(err?.message || 'Failed to update stock', 'error');
    }
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (productId: number) => {
    try {
      const updated = await productsApi.toggleStatus(productId);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, active: updated.active } : p))
      );
      showToast(`Product is now ${updated.active ? 'Active (visible)' : 'Inactive (hidden)'}`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle status', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (p: Product) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${p.name}"?`)) {
      return;
    }

    try {
      await productsApi.deleteProduct(p.id);
      showToast(`Product "${p.name}" deleted from database.`, 'success');
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete product', 'error');
    }
  };

  // Filter products for admin table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchFilter === '' ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory =
      selectedCategory === '' || p.categorySlug === selectedCategory || String(p.categoryId) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input for fast row image replacement */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleRowFileSelected}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Inventory &amp; Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Centrally stored in MySQL. Product records and uploaded images are permanently stored and immediately synchronized across all devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-agri-500 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <LoadingSpinner message="Loading inventory from MySQL database..." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">Pack Size</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const isOut = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition">
                      {/* Image Thumbnail with 1-Click Replace Button */}
                      <td className="py-3 px-4">
                        <div className="relative group w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img
                            src={resolveImageUrl(p.imageUrl, DEFAULT_PRODUCT_FALLBACK)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => triggerRowImageUpload(p.id)}
                            title="Replace product image from Gallery/Files"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold"
                          >
                            <Upload className="w-4 h-4 mb-0.5" />
                            <span>Replace</span>
                          </button>
                        </div>
                      </td>

                      {/* Product Name & Brand */}
                      <td className="py-3 px-4 max-w-xs">
                        <span className="text-[10px] font-bold uppercase text-agri-700 bg-agri-50 px-2 py-0.5 rounded">
                          {p.brand}
                        </span>
                        <div className="font-extrabold text-gray-900 text-sm mt-0.5 truncate">
                          {p.name}
                        </div>
                        {p.featured && (
                          <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                            ★ Featured
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        {p.categoryName || 'General'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-black text-gray-900 text-sm">
                        ₹{Number(p.price).toFixed(2)}
                      </td>

                      {/* Pack Size */}
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {p.packSize}
                      </td>

                      {/* Stock with inline adjuster */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStockChange(p.id, p.stock, -5)}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              isOut
                                ? 'bg-red-100 text-red-800'
                                : p.stock <= 10
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockChange(p.id, p.stock, 5)}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(p.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                            p.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {p.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.active ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => triggerRowImageUpload(p.id)}
                            title="Replace Image (Cloudinary)"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-agri-700 hover:bg-agri-50 transition"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Product Details"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-700 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-xs">
                No products match the selected search or category filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-agri-700">
                  Product Details
                </span>
                <h3 className="text-lg font-black text-gray-900">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Agricultural Product'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gromor DAP 18:46:0"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Manufacturer / Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coromandel, Bayer, FMC"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Price in INR (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="1350.00"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pack Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 kg Bag, 1 Litre"
                    value={formPackSize}
                    onChange={(e) => setFormPackSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Available Stock Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="w-4 h-4 text-agri-600 rounded"
                    />
                    <span>Active (Visible to Customers)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 text-agri-600 rounded"
                    />
                    <span>Featured on Home</span>
                  </label>
                </div>
              </div>

              {/* Advance Booking Configuration */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={formBookingAvailable}
                    onChange={(e) => setFormBookingAvailable(e.target.checked)}
                    className="w-4 h-4 text-agri-600 rounded"
                  />
                  <span>Allow Advance Booking (Customer can reserve without payment)</span>
                </label>
                {formBookingAvailable && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Advance Booking Notes (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Recommended for early booking before upcoming season"
                      value={formBookingNotes}
                      onChange={(e) => setFormBookingNotes(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Image Upload Section */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <label className="block text-xs font-bold text-gray-900">
                  Product Picture (Persistent Storage)
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {formImageUrl && (
                    <img
                      src={resolveImageUrl(formImageUrl, DEFAULT_PRODUCT_FALLBACK)}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 bg-white shrink-0"
                    />
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-sm transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          onChange={handleModalImageUpload}
                          disabled={isUploadingImage}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-gray-500">or enter image URL below</span>
                    </div>

                    <input
                      type="text"
                      placeholder="https://res.cloudinary.com/... or image link"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-agri-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Description &amp; Usage Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Key crop benefits, dosage guidelines, recommended application time..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving to Database...' : 'Save Product in MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
