import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { SectionTitle } from '../../components/Layout';
import { Button, FormField, SkeletonForm } from '../../components/Common';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  ChevronLeft, 
  Upload, 
  Info,
  Layers,
  Search,
  Settings
} from 'lucide-react';
import { adminProductService } from '../../api/services/adminProductService';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import { cn } from '../../api/utils';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    price: '',
    show_price: true,
    benefits: [''],
    how_to_use: '',
    ingredients: '',
    featured: false,
    status: 'active',
    sort_order: 0,
    seo_title: '',
    seo_description: '',
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await adminProductService.getOne(id);
          const p = response.data;
          setFormData({
            ...p,
            benefits: p.benefits || [''],
            price: p.price || '',
          });
          setImages(p.images || []);
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error(t('admin.loadProductError'));
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'name' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }));
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, benefits: newBenefits.length ? newBenefits : [''] }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !isEdit) return;

    const data = new FormData();
    files.forEach(file => data.append('images[]', file));

    try {
      const response = await adminProductService.uploadImages(id, data);
      setImages([...images, ...response.data]);
      toast.success(t('admin.imagesUploaded'));
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(t('admin.uploadError'));
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await adminProductService.setPrimaryImage(id, imageId);
      setImages(images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
      toast.success(t('admin.primaryUpdated'));
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast.error(t('admin.primaryUpdateError'));
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm(t('admin.confirmDeleteImage'))) return;

    try {
      await adminProductService.deleteImage(id, imageId);
      setImages(images.filter(img => img.id !== imageId));
      toast.success(t('admin.imageDeleted'));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(t('admin.imageDeleteError'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEdit) {
        await adminProductService.update(id, formData);
        toast.success(t('admin.productUpdated'));
        navigate('/admin/products');
      } else {
        const response = await adminProductService.create(formData);
        toast.success(t('admin.productCreated'));
        navigate(`/admin/products/${response.data.id}/edit`);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        setActiveTab('general');
        toast.error(t('admin.fixErrors'));
      } else {
        toast.error(t('admin.saveError'));
      }
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-8 max-w-5xl">
        <div className="h-20 bg-slate-100 rounded-2xl w-1/2 animate-pulse" />
        <SkeletonForm fields={8} />
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-2 px-6 py-3 border-b-2 font-semibold whitespace-nowrap flex-shrink-0 transition-all",
        activeTab === id 
          ? "border-muru-pink text-muru-pink" 
          : "border-transparent text-muru-text-secondary hover:text-muru-text-main"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/admin/products" className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-muru-border">
            <ChevronLeft className="w-6 h-6 text-muru-text-secondary" />
          </Link>
          <SectionTitle 
            title={isEdit ? `${t('admin.editProduct')} ${formData.name}` : t('admin.createNewProduct')} 
            subtitle={isEdit ? t('admin.editSubtitle') : t('admin.createSubtitle')}
            className="mb-0"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/admin/products')} className="flex-grow sm:flex-grow-0">{t('admin.cancel')}</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            loading={loading}
            className="flex-grow sm:flex-grow-0 min-w-[120px]"
          >
            {!loading && (isEdit ? t('admin.saveChangesBtn') : t('admin.createProductBtn'))}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-muru-border shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto bg-slate-50/50 border-b border-muru-border px-4 pt-2">
          <TabButton id="general" label={t('admin.generalInfo')} icon={Info} />
          <TabButton id="details" label={t('admin.detailsBenefits')} icon={Layers} />
          <TabButton id="images" label={t('admin.productImages')} icon={ImageIcon} />
          <TabButton id="seo" label={t('admin.seoSettings')} icon={Search} />
          <TabButton id="advanced" label={t('admin.advanced')} icon={Settings} />
        </div>

        <div className="p-6 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="md:col-span-2">
                  <FormField 
                    label={t('admin.productName')} 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name?.[0]}
                    placeholder={t('admin.namePlaceholder')}
                    required
                  />
                </div>
                <FormField 
                  label={t('admin.urlSlug')} 
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  error={errors.slug?.[0]}
                  placeholder={t('admin.slugPlaceholder')}
                  required
                />
                <FormField 
                  label={t('admin.priceLabel')} 
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price?.[0]}
                  placeholder={t('admin.pricePlaceholder')}
                />
                <div className="md:col-span-2">
                  <FormField 
                    label={t('admin.shortDescription')} 
                    name="short_description"
                    type="textarea"
                    value={formData.short_description}
                    onChange={handleChange}
                    error={errors.short_description?.[0]}
                    placeholder={t('admin.shortDescPlaceholder')}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField 
                    label={t('admin.fullDescription')} 
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description?.[0]}
                    placeholder={t('admin.fullDescPlaceholder')}
                    rows={8}
                  />
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muru-text-secondary flex items-center justify-between">
                    {t('admin.productBenefits')}
                    <button type="button" onClick={addBenefit} className="text-muru-pink flex items-center gap-1 hover:underline">
                      <Plus className="w-4 h-4" /> {t('admin.add')}
                    </button>
                  </label>
                  <div className="space-y-3">
                    {formData.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-3">
                        <FormField
                          value={benefit}
                          onChange={(e) => handleBenefitChange(idx, e.target.value)}
                          placeholder={`${t('admin.benefitPlaceholder')}${idx + 1}`}
                        />
                        <button 
                          type="button" 
                          onClick={() => removeBenefit(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          aria-label={`Remove benefit ${idx + 1}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <FormField 
                  label={t('admin.howToUse')} 
                  name="how_to_use"
                  type="textarea"
                  value={formData.how_to_use}
                  onChange={handleChange}
                  placeholder={t('admin.howToUsePlaceholder')}
                  rows={4}
                />

                <FormField 
                  label={t('admin.keyIngredients')} 
                  name="ingredients"
                  type="textarea"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder={t('admin.ingredientsPlaceholder')}
                  rows={4}
                />
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {!isEdit ? (
                  <div className="bg-muru-pink-soft/30 p-12 rounded-2xl border border-dashed border-muru-pink/30 text-center">
                    <p className="text-muru-text-main font-bold mb-2">{t('admin.almostThere')}</p>
                    <p className="text-muru-text-secondary text-sm">{t('admin.saveFirst')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h4 className="font-bold text-muru-text-main">{t('admin.uploadedImages')} ({images.length})</h4>
                      <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-muru-pink text-white font-semibold hover:bg-muru-pink-dark transition-all shadow-lg shadow-muru-pink/20">
                        <Upload className="w-4 h-4" />
                        {t('admin.uploadImages')}
                        <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {images.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-muru-border bg-slate-50">
                          <img src={img.url} alt={t('admin.product')} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            {img.is_primary ? (
                              <span className="bg-muru-pink text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">{t('admin.primary')}</span>
                            ) : (
                              <button 
                                type="button" 
                                onClick={() => handleSetPrimary(img.id)}
                                className="text-white text-xs font-bold hover:underline"
                              >
                                {t('admin.makePrimary')}
                              </button>
                            )}
                            <button 
                              type="button" 
                              onClick={() => handleDeleteImage(img.id)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all" 
                              aria-label={t('admin.deleteImage')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <FormField 
                  label={t('admin.seoTitle')} 
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  placeholder={t('admin.seoTitlePlaceholder')}
                />
                <FormField 
                  label={t('admin.seoDescription')} 
                  name="seo_description"
                  type="textarea"
                  value={formData.seo_description}
                  onChange={handleChange}
                  placeholder={t('admin.seoDescPlaceholder')}
                  rows={4}
                />
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-muru-border bg-slate-50/50">
                    <div>
                      <p className="font-bold text-muru-text-main">{t('admin.featuredProduct')}</p>
                      <p className="text-xs text-muru-text-secondary">{t('admin.showOnHomepage')}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={formData.featured} 
                      onChange={handleChange}
                      className="w-6 h-6 accent-muru-pink"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-muru-border bg-slate-50/50">
                    <div>
                      <p className="font-bold text-muru-text-main">{t('admin.showPrice')}</p>
                      <p className="text-xs text-muru-text-secondary">{t('admin.displayPrice')}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="show_price" 
                      checked={formData.show_price} 
                      onChange={handleChange}
                      className="w-6 h-6 accent-muru-pink"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muru-text-secondary">{t('admin.visibilityStatus')}</label>
                    <div className="flex gap-4">
                      {['active', 'hidden'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                          className={cn(
                            "flex-grow py-3 rounded-xl border-2 font-bold uppercase tracking-widest text-xs transition-all",
                            formData.status === s 
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
                    value={formData.sort_order}
                    onChange={handleChange}
                    placeholder={t('admin.sortOrderPlaceholder')}
                  />
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
