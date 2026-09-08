import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../../components/Layout';
import { Button, FormField, SkeletonForm } from '../../components/Common';
import { 
  Save, 
  Globe, 
  Shield, 
  Layout, 
  Share2,
  Phone,
  Monitor,
  Search
} from 'lucide-react';
import { adminContentService } from '../../api/services/adminContentService';
import toast from 'react-hot-toast';
import { cn } from '../../api/utils';

const WebsiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('brand');
  const [settings, setSettings] = useState({
    site_name: 'MURU',
    logo: '',
    favicon: '',
    website_url: '',
    default_language: 'en',
    telegram_url: '',
    phone: '',
    email: '',
    address: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    show_prices_globally: true,
    products_per_page: 12,
    default_title: 'MURU | Premium Skincare',
    default_meta_description: '',
    social_sharing_image: '',
    footer_description: '',
    copyright_text: `© ${new Date().getFullYear()} MURU. All rights reserved.`
  });
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  const [socialPreview, setSocialPreview] = useState('');
  const [socialFile, setSocialFile] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await adminContentService.getSettings();
        if (response.data && Object.keys(response.data).length > 0) {
          const data = response.data;
          setSettings(prev => ({
            ...prev,
            ...data,
            show_prices_globally: data.show_prices_globally === '1' || data.show_prices_globally === true
          }));
          if (data.logo) setLogoPreview(data.logo);
          if (data.favicon) setFaviconPreview(data.favicon);
          if (data.social_sharing_image) setSocialPreview(data.social_sharing_image);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load website settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      
      if (name === 'logo_file') {
        setLogoFile(file);
        setLogoPreview(previewUrl);
      } else if (name === 'favicon_file') {
        setFaviconFile(file);
        setFaviconPreview(previewUrl);
      } else if (name === 'social_file') {
        setSocialFile(file);
        setSocialPreview(previewUrl);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Add all text settings
      Object.keys(settings).forEach(key => {
        formData.append(key, settings[key]);
      });

      // Add files if selected
      if (logoFile) formData.append('logo_file', logoFile);
      if (faviconFile) formData.append('favicon_file', faviconFile);
      if (socialFile) formData.append('social_file', socialFile);

      await adminContentService.updateSettings(formData);
      toast.success('Website settings updated successfully!');
      
      // Refresh settings to get new URLs
      const response = await adminContentService.getSettings();
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
        setLogoFile(null);
        setFaviconFile(null);
        setSocialFile(null);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      const validationMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()[0]
        : null;
      toast.error(validationMessage || error.response?.data?.message || 'Failed to save website settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonForm fields={6} />;

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={cn(
        "flex lg:w-full items-center gap-3 px-6 py-4 transition-all border-b-2 lg:border-b-0 lg:border-l-4 whitespace-nowrap lg:whitespace-normal",
        activeSection === id 
          ? "bg-muru-pink-soft text-muru-pink border-muru-pink font-bold" 
          : "text-muru-text-secondary border-transparent hover:bg-slate-50 hover:text-muru-text-main"
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle 
          title="Website Settings" 
          subtitle="Configure your brand, SEO, and global website behavior." 
          className="mb-0"
        />
        <Button variant="primary" onClick={handleSave} loading={saving} className="min-w-[140px]">
          {!saving && <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-muru-border shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-muru-border bg-slate-50/30">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible py-2 lg:py-4">
            <NavItem id="brand" label="Brand" icon={Shield} />
            <NavItem id="general" label="General" icon={Globe} />
            <NavItem id="contact" label="Contact" icon={Phone} />
            <NavItem id="social" label="Social Media" icon={Share2} />
            <NavItem id="display" label="Product Display" icon={Monitor} />
            <NavItem id="seo" label="SEO & Sharing" icon={Search} />
            <NavItem id="footer" label="Footer" icon={Layout} />
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-6 lg:p-12 animate-in fade-in duration-300">
          
          {activeSection === 'brand' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-muru-text-main border-b border-muru-border pb-4">Brand Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <FormField label="Site Name" name="site_name" value={settings.site_name} onChange={handleChange} placeholder="MURU" />
                </div>
                
                {/* Logo Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-muru-text-main">Brand Logo</label>
                  <div className="flex items-center gap-6 p-4 rounded-2xl border border-muru-border bg-slate-50/50">
                    <div className="w-20 h-20 rounded-xl border border-muru-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-[10px] text-muru-text-secondary uppercase font-bold">No Logo</div>
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                      <input 
                        type="file" 
                        name="logo_file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="text-xs text-muru-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-muru-pink file:text-white hover:file:bg-muru-pink-dark cursor-pointer w-full"
                      />
                      <p className="text-[10px] text-muru-text-secondary">Recommended: PNG or SVG with transparent background</p>
                    </div>
                  </div>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-muru-text-main">Favicon</label>
                  <div className="flex items-center gap-6 p-4 rounded-2xl border border-muru-border bg-slate-50/50">
                    <div className="w-20 h-20 rounded-xl border border-muru-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      {faviconPreview ? (
                        <img src={faviconPreview} alt="Favicon" className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="text-[10px] text-muru-text-secondary uppercase font-bold text-center">No Icon</div>
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                      <input 
                        type="file" 
                        name="favicon_file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="text-xs text-muru-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-muru-pink file:text-white hover:file:bg-muru-pink-dark cursor-pointer w-full"
                      />
                      <p className="text-[10px] text-muru-text-secondary">Recommended: 32x32 or 64x64 PNG/ICO</p>
                    </div>
                  </div>
                </div>

                {/* Legacy URL Fields (Optional, keeping for compatibility or manual entry) */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 opacity-60">
                  <FormField label="Logo URL (Manual Override)" name="logo" value={settings.logo} onChange={handleChange} placeholder="https://..." />
                  <FormField label="Favicon URL (Manual Override)" name="favicon" value={settings.favicon} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'general' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-muru-text-main border-b border-muru-border pb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Website URL" name="website_url" value={settings.website_url} onChange={handleChange} placeholder="https://muru-skincare.com" />
                <FormField 
                  label="Default Language" 
                  name="default_language" 
                  type="select"
                  value={settings.default_language} 
                  onChange={handleChange}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'kh', label: 'Khmer' }
                  ]}
                />
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-muru-text-main border-b border-muru-border pb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Telegram URL" name="telegram_url" value={settings.telegram_url} onChange={handleChange} placeholder="https://t.me/..." />
                <FormField label="Phone" name="phone" value={settings.phone} onChange={handleChange} placeholder="+855 ..." />
                <FormField label="Email" name="email" value={settings.email} onChange={handleChange} placeholder="hello@..." />
                <div className="md:col-span-2">
                  <FormField label="Address" name="address" type="textarea" value={settings.address} onChange={handleChange} rows={2} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-muru-text-main border-b border-muru-border pb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Instagram" name="instagram" value={settings.instagram} onChange={handleChange} />
                <FormField label="Facebook" name="facebook" value={settings.facebook} onChange={handleChange} />
                <FormField label="TikTok" name="tiktok" value={settings.tiktok} onChange={handleChange} />
                <FormField label="YouTube" name="youtube" value={settings.youtube} onChange={handleChange} />
              </div>
            </div>
          )}

          {activeSection === 'display' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-muru-text-main border-b border-muru-border pb-4">Product Display Behavior</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-muru-border bg-slate-50/50">
                  <div>
                    <p className="font-bold text-muru-text-main">Show Prices Globally</p>
                    <p className="text-xs text-muru-text-secondary">Display pricing across the site</p>
                  </div>
                  <input 
                    type="checkbox" 
                    name="show_prices_globally" 
                    checked={settings.show_prices_globally} 
                    onChange={handleChange}
                    className="w-6 h-6 accent-muru-pink"
                  />
                </div>
                <FormField label="Products Per Page" name="products_per_page" type="number" value={settings.products_per_page} onChange={handleChange} />
              </div>
            </div>
          )}

          {activeSection === 'seo' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-muru-text-main border-b border-muru-border pb-4">SEO & Social Sharing</h3>
              <div className="space-y-6">
                <FormField label="Default Page Title" name="default_title" value={settings.default_title} onChange={handleChange} />
                <FormField label="Default Meta Description" name="default_meta_description" type="textarea" value={settings.default_meta_description} onChange={handleChange} rows={3} />
                
                {/* Social Sharing Image Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-muru-text-main">Social Sharing Image (Open Graph)</label>
                  <div className="flex flex-col gap-4 p-4 rounded-2xl border border-muru-border bg-slate-50/50">
                    <div className="w-full h-48 rounded-xl border border-muru-border bg-white flex items-center justify-center overflow-hidden">
                      {socialPreview ? (
                        <img src={socialPreview} alt="Social Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-muru-text-secondary uppercase font-bold">No Image Selected</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input 
                        type="file" 
                        name="social_file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="text-xs text-muru-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-muru-pink file:text-white hover:file:bg-muru-pink-dark cursor-pointer w-full"
                      />
                      <p className="text-[10px] text-muru-text-secondary">Recommended: 1200x630px JPG or PNG</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 opacity-60">
                  <FormField label="Social Sharing Image URL (Manual Override)" name="social_sharing_image" value={settings.social_sharing_image} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'footer' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-muru-text-main border-b border-muru-border pb-4">Footer Content</h3>
              <div className="space-y-6">
                <FormField label="Short Brand Description" name="footer_description" type="textarea" value={settings.footer_description} onChange={handleChange} rows={3} />
                <FormField label="Copyright Text" name="copyright_text" value={settings.copyright_text} onChange={handleChange} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;
