import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../components/Layout';
import { Button, FormField } from '../../components/Common';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { adminProductService } from '../../api/services/adminProductService';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import { cn } from '../../api/utils';

const ProductList = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('sort_order');
  const [sortDirection, setSortDirection] = useState('asc');
  const [deleteId, setDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    slug: '',
    price: '',
    short_description: '',
    description: '',
    benefits: [''],
    how_to_use: '',
    ingredients: '',
    status: 'active',
    sort_order: 0,
    images: [] // To store selected file objects
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [editImages, setEditImages] = useState([]);

  const handleAddImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setAddFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSetEditPrimary = async (imageId) => {
    if (!editingProductId) return;
    try {
      await adminProductService.setPrimaryImage(editingProductId, imageId);
      setEditImages(prev => prev.map(image => ({
        ...image,
        is_primary: image.id === imageId
      })));
      toast.success(t('admin.primaryUpdated'));
      fetchProducts(pagination.current_page);
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast.error(t('admin.primaryUpdateError'));
    }
  };

  const handleDeleteEditImage = async (imageId) => {
    if (!editingProductId || !window.confirm(t('admin.confirmDeleteImage'))) return;
    try {
      await adminProductService.deleteImage(editingProductId, imageId);
      setEditImages(prev => prev.filter(image => image.id !== imageId));
      toast.success(t('admin.imageDeleted'));
      fetchProducts(pagination.current_page);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(t('admin.imageDeleteError'));
    }
  };

  const removeSelectedImage = (index) => {
    setAddFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Clean up object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBenefitChange = (index, value) => {
    const newBenefits = [...addFormData.benefits];
    newBenefits[index] = value;
    setAddFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addAddBenefit = () => {
    setAddFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const removeAddBenefit = (index) => {
    const newBenefits = addFormData.benefits.filter((_, i) => i !== index);
    setAddFormData(prev => ({ ...prev, benefits: newBenefits.length ? newBenefits : [''] }));
  };
  const [addErrors, setAddErrors] = useState({});
  const modalRef = useRef(null);
  const addModalRef = useRef(null);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminProductService.getAll({
        page,
        search,
        status,
        sort_by: sortBy,
        sort_direction: sortDirection
      });
      setProducts(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(t('admin.loadProductsError'));
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, sortDirection]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Escape key and focus trap for modals
  useEffect(() => {
    if (!deleteId && !showAddModal) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDeleteId(null);
        setShowAddModal(false);
        setEditingProductId(null);
      }
      // Focus trap
      const currentModal = modalRef.current || addModalRef.current;
      if (e.key === 'Tab' && currentModal) {
        const focusable = currentModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    (modalRef.current || addModalRef.current)?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [deleteId, showAddModal]);

  const handleToggleStatus = async (id) => {
    try {
      await adminProductService.toggleStatus(id);
      toast.success(t('admin.statusUpdated'));
      fetchProducts(pagination.current_page);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(t('admin.statusUpdateError'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminProductService.delete(deleteId);
      toast.success(t('admin.productDeleted'));
      setDeleteId(null);
      fetchProducts(pagination.current_page);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(t('admin.deleteError'));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddErrors({});

    try {
      const { images, ...productData } = addFormData;
      const productRes = editingProductId
        ? await adminProductService.update(editingProductId, productData)
        : await adminProductService.create(productData);
      const productId = editingProductId || productRes.data.id;

      // Upload newly selected images after the product has been saved.
      if (images.length > 0) {
        const imageData = new FormData();
        images.forEach(file => imageData.append('images[]', file));
        await adminProductService.uploadImages(productId, imageData);
      }

      toast.success(t(editingProductId ? 'admin.productUpdated' : 'admin.productCreated'));
      setShowAddModal(false);
      setEditingProductId(null);
      
      // Reset form and previews
      setAddFormData({
        name: '',
        slug: '',
        price: '',
        short_description: '',
        description: '',
        benefits: [''],
        how_to_use: '',
        ingredients: '',
        status: 'active',
        sort_order: 0,
        images: []
      });
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      
      fetchProducts(pagination.current_page);
      
      if (!editingProductId) {
        toast((toastItem) => (
          <span>
            {t('admin.productCreated')} <button className="text-muru-pink font-bold underline ml-1" onClick={() => {
              toast.dismiss(toastItem.id);
              navigate(`/admin/products/${productId}/edit`);
            }}>{t('admin.editFullDetails')}</button>
          </span>
        ), { duration: 5000 });
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setAddErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || t(editingProductId ? 'admin.saveError' : 'admin.createError'));
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'name') {
        newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      return newData;
    });
  };

  const handleEditProduct = async (productId) => {
    setAddLoading(true);
    try {
      const response = await adminProductService.getOne(productId);
      const product = response.data;
      setEditingProductId(productId);
      setAddFormData({
        name: product.name || '',
        slug: product.slug || '',
        price: product.price || '',
        short_description: product.short_description || '',
        description: product.description || '',
        benefits: product.benefits?.length ? product.benefits : [''],
        how_to_use: product.how_to_use || '',
        ingredients: product.ingredients || '',
        status: product.status || 'active',
        sort_order: product.sort_order || 0,
        images: []
      });
      setEditImages(product.images || []);
      setImagePreviews([]);
      setAddErrors({});
      setShowAddModal(true);
    } catch (error) {
      console.error('Error loading product for edit:', error);
      toast.error(t('admin.loadProductError'));
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle 
          title={t('admin.productListTitle')} 
          subtitle={t('admin.productListSubtitle')} 
          className="mb-0"
        />
        <Button 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={() => {
            setEditingProductId(null);
            setShowAddModal(true);
          }}
        >
          <Plus className="w-4 h-4" />
          {t('admin.addProduct')}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-muru-border shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muru-text-secondary" />
          <input 
            type="text" 
            placeholder={t('admin.searchPlaceholder')} 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-muru-border focus:outline-none focus:border-muru-pink focus:ring-2 focus:ring-muru-pink/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <select 
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-muru-border focus:outline-none focus:border-muru-pink focus:ring-2 focus:ring-muru-pink/20 bg-white text-muru-text-main font-medium transition-all"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">{t('admin.allStatus')}</option>
            <option value="active">{t('admin.active')}</option>
            <option value="hidden">{t('admin.hidden')}</option>
          </select>
          <select 
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-muru-border focus:outline-none focus:border-muru-pink focus:ring-2 focus:ring-muru-pink/20 bg-white text-muru-text-main font-medium transition-all"
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-');
              setSortBy(field);
              setSortDirection(dir);
            }}
          >
            <option value="sort_order-asc">{t('admin.sortAsc')}</option>
            <option value="sort_order-desc">{t('admin.sortDesc')}</option>
            <option value="name-asc">{t('admin.nameAZ')}</option>
            <option value="name-desc">{t('admin.nameZA')}</option>
            <option value="price-asc">{t('admin.priceLow')}</option>
            <option value="price-desc">{t('admin.priceHigh')}</option>
            <option value="updated_at-desc">{t('admin.recentlyUpdated')}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-muru-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-muru-border text-xs uppercase tracking-widest text-muru-text-secondary">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('admin.product')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('admin.price')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('admin.featured')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('admin.status')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('admin.order')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('admin.updated')}</th>
                <th className="px-6 py-4 font-semibold text-right">{t('admin.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muru-border">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4">
                      <div className="h-12 bg-slate-100 rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muru-pink-soft overflow-hidden border border-muru-border/50">
                          {product.primary_image ? (
                            <img src={product.primary_image.url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-muru-pink/30" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-muru-text-main group-hover:text-muru-pink transition-colors">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-muru-text-main">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.featured ? (
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto" />
                      ) : (
                        <Star className="w-5 h-5 text-slate-200 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleStatus(product.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        aria-label={`Toggle status: current is ${product.status}`}
                      >
                        {product.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-muru-text-secondary font-medium">
                      {product.sort_order}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muru-text-secondary">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`/products/${product.slug}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-muru-text-secondary hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                          title={t('admin.preview')}
                          aria-label={`${t('admin.preview')} ${product.name}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link 
                          to="#"
                          onClick={(event) => {
                            event.preventDefault();
                            handleEditProduct(product.id);
                          }}
                          className="p-2 text-muru-text-secondary hover:text-muru-pink transition-colors rounded-lg hover:bg-muru-pink-soft"
                          title={t('admin.edit')}
                          aria-label={`${t('admin.edit')} ${product.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-muru-text-secondary hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          title={t('admin.delete')}
                          aria-label={`${t('admin.delete')} ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-muru-text-secondary">
                    <div className="flex flex-col items-center gap-4">
                      <ShoppingBag className="w-12 h-12 text-slate-200" />
                      <p className="text-lg font-medium">{t('admin.noProductsFound')}</p>
                      <Link to="/admin/products/create">
                        <Button variant="ghost">{t('admin.addFirstProduct')}</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-muru-border">
            <p className="text-sm text-muru-text-secondary font-medium">
              {t('admin.showingPage').replace('{current}', pagination.current_page).replace('{last}', pagination.last_page)}
            </p>
            <div className="flex gap-2">
              <button 
                disabled={pagination.current_page === 1}
                onClick={() => fetchProducts(pagination.current_page - 1)}
                className="p-2 rounded-lg border border-muru-border bg-white text-muru-text-main disabled:opacity-50 hover:bg-slate-50 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => fetchProducts(pagination.current_page + 1)}
                className="p-2 rounded-lg border border-muru-border bg-white text-muru-text-main disabled:opacity-50 hover:bg-slate-50 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
            tabIndex={-1}
          >
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 id="delete-modal-title" className="text-2xl font-bold text-muru-text-main text-center mb-2">{t('admin.deleteProduct')}</h3>
            <p className="text-muru-text-secondary text-center mb-8">
              {t('admin.deleteWarning')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="ghost" 
                className="flex-grow py-3"
                onClick={() => setDeleteId(null)}
              >
                {t('admin.cancel')}
              </Button>
              <Button 
                variant="danger" 
                className="flex-grow py-3 shadow-lg shadow-red-200"
                onClick={handleDelete}
              >
                {t('admin.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Product Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
        >
          <div 
            ref={addModalRef}
            className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-w-2xl w-full max-h-[90vh] flex flex-col"
            tabIndex={-1}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-muru-border">
              <div>
                <h3 id="add-modal-title" className="text-2xl font-bold text-muru-text-main">
                  {t(editingProductId ? 'admin.editProduct' : 'admin.quickAddProduct')}
                </h3>
                <p className="text-sm text-muru-text-secondary mt-1">
                  {t(editingProductId ? 'admin.editSubtitle' : 'admin.quickAddSubtitle')}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProductId(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-muru-text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <form id="quick-add-form" onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField 
                      label={t('admin.productName')} 
                      name="name"
                      value={addFormData.name}
                      onChange={handleAddChange}
                      error={addErrors.name?.[0]}
                      placeholder={t('admin.namePlaceholder')}
                      required
                      autoFocus
                    />
                  </div>
                  <FormField 
                    label={t('admin.urlSlug')} 
                    name="slug"
                    value={addFormData.slug}
                    onChange={handleAddChange}
                    error={addErrors.slug?.[0]}
                    placeholder={t('admin.slugPlaceholder')}
                    required
                  />
                  <FormField 
                    label={t('admin.priceLabel')} 
                    name="price"
                    type="number"
                    step="0.01"
                    value={addFormData.price}
                    onChange={handleAddChange}
                    error={addErrors.price?.[0]}
                    placeholder={t('admin.pricePlaceholder')}
                  />
                  <div className="md:col-span-2">
                    <FormField 
                      label={t('admin.shortDescription')} 
                      name="short_description"
                      type="textarea"
                      value={addFormData.short_description}
                      onChange={handleAddChange}
                      error={addErrors.short_description?.[0]}
                      placeholder={t('admin.shortDescPlaceholder')}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FormField 
                      label={t('admin.fullDescription')} 
                      name="description"
                      type="textarea"
                      value={addFormData.description}
                      onChange={handleAddChange}
                      error={addErrors.description?.[0]}
                      placeholder={t('admin.fullDescPlaceholder')}
                      rows={5}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-muru-text-secondary flex items-center justify-between">
                      {t('admin.productBenefits')}
                      <button type="button" onClick={addAddBenefit} className="text-muru-pink flex items-center gap-1 hover:underline">
                        <Plus className="w-4 h-4" /> {t('admin.add')}
                      </button>
                    </label>
                    <div className="space-y-3">
                      {addFormData.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex gap-3">
                          <FormField
                            value={benefit}
                            onChange={(e) => handleAddBenefitChange(idx, e.target.value)}
                            placeholder={`${t('admin.benefitPlaceholder')}${idx + 1}`}
                          />
                          <button 
                            type="button" 
                            onClick={() => removeAddBenefit(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <FormField 
                      label={t('admin.howToUse')} 
                      name="how_to_use"
                      type="textarea"
                      value={addFormData.how_to_use}
                      onChange={handleAddChange}
                      placeholder={t('admin.howToUsePlaceholder')}
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormField 
                      label={t('admin.keyIngredients')} 
                      name="ingredients"
                      type="textarea"
                      value={addFormData.ingredients}
                      onChange={handleAddChange}
                      placeholder={t('admin.ingredientsPlaceholder')}
                      rows={3}
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-muru-text-secondary">
                      <span className="inline-flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {t('admin.productImages')}
                      </span>
                    </label>

                    {editingProductId && editImages.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muru-text-secondary">
                          {t('admin.uploadedImages')} ({editImages.length})
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {editImages.map(image => (
                            <div key={image.id} className="group relative aspect-square rounded-xl overflow-hidden border border-muru-border bg-slate-50">
                              <img src={image.url} alt={t('admin.product')} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                {image.is_primary ? (
                                  <span className="bg-muru-pink text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                                    {t('admin.primary')}
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetEditPrimary(image.id)}
                                    className="text-white text-xs font-bold hover:underline"
                                  >
                                    {t('admin.makePrimary')}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEditImage(image.id)}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                  aria-label={t('admin.deleteImage')}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {image.is_primary && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-muru-pink text-white text-[10px] font-bold uppercase tracking-widest rounded">
                                  {t('admin.primaryBadge')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-muru-border bg-slate-50">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => removeSelectedImage(idx)}
                              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-muru-pink text-white text-[10px] font-bold uppercase tracking-widest rounded">
                              {t('admin.primaryBadge')}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <label className="aspect-square rounded-xl border-2 border-dashed border-muru-border hover:border-muru-pink hover:bg-muru-pink-soft/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                        <div className="p-2 rounded-full bg-slate-50 group-hover:bg-muru-pink/10 transition-colors">
                          <Upload className="w-5 h-5 text-muru-text-secondary group-hover:text-muru-pink" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muru-text-secondary group-hover:text-muru-pink">{t('admin.addImage')}</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAddImageChange} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muru-text-secondary">{t('admin.visibilityStatus')}</label>
                    <div className="flex gap-4">
                      {['active', 'hidden'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setAddFormData(prev => ({ ...prev, status: s }))}
                          className={cn(
                            "flex-grow py-2.5 rounded-xl border-2 font-bold uppercase tracking-widest text-xs transition-all",
                            addFormData.status === s 
                              ? "border-muru-pink bg-muru-pink-soft text-muru-pink" 
                              : "border-muru-border text-muru-text-secondary"
                          )}
                        >
                          {s === 'active' ? t('admin.active') : t('admin.hidden')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <FormField 
                    label={t('admin.sortOrder')} 
                    name="sort_order"
                    type="number"
                    value={addFormData.sort_order}
                    onChange={handleAddChange}
                    placeholder={t('admin.sortOrderPlaceholder')}
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-muru-border bg-slate-50/50 flex flex-col sm:flex-row gap-4">
              <Button 
                variant="ghost" 
                className="flex-grow py-3"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProductId(null);
                }}
              >
                {t('admin.cancel')}
              </Button>
              <Button 
                variant="primary" 
                className="flex-grow py-3 shadow-lg shadow-muru-pink/20"
                form="quick-add-form"
                type="submit"
                loading={addLoading}
              >
                {t(editingProductId ? 'admin.saveChangesBtn' : 'admin.createProduct')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
