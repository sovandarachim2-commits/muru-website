import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../../components/Layout';
import { Button, FormField, SectionWrapper, SkeletonForm } from '../../components/Common';
import { 
  Save, 
  ExternalLink, 
  Phone, 
  Send,
  Globe
} from 'lucide-react';
import { InstagramIcon } from '../../components/BrandIcons';
import { adminContentService } from '../../api/services/adminContentService';
import { settingsService } from '../../api/services/settingsService';
import toast from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';

const ContactManagement = () => {
  const { updateSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contact_title: '',
    contact_subtitle: '',
    telegram: '',
    telegram_label: '',
    telegram_url: '',
    phone: '',
    email: '',
    address: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    contact_image: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsService.getSettings();
        if (response.data) {
          setFormData(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Failed to fetch contact settings:', error);
        toast.error('Failed to load contact settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await adminContentService.updateContact(formData);
      updateSettings(response.data);
      toast.success('Contact settings saved successfully!');
    } catch (error) {
      console.error('Failed to save contact settings:', error);
      toast.error('Failed to save contact settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonForm fields={10} />;

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle 
          title="Contact Management" 
          subtitle="Manage how customers can reach out to MURU." 
          className="mb-0"
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => window.open('/contact', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" /> Preview
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            {!saving && <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
          </Button>
        </div>
      </div>

      {/* CONTACT PAGE CONTENT */}
      <SectionWrapper title="Contact Page Content" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Page Title" 
            name="contact_title"
            value={formData.contact_title} 
            onChange={handleChange}
            placeholder="CONTACT US"
          />
          <div className="md:col-span-2">
            <FormField 
              label="Page Subtitle" 
              name="contact_subtitle"
              type="textarea"
              value={formData.contact_subtitle} 
              onChange={handleChange}
              placeholder="Need help with a MURU product? Our team is here to help."
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <FormField 
              label="Contact Image URL (Optional)" 
              name="contact_image"
              value={formData.contact_image} 
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </SectionWrapper>

      {/* TELEGRAM SETTINGS */}
      <SectionWrapper title="Telegram Settings" icon={Send}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField 
            label="Telegram Label" 
            name="telegram_label"
            value={formData.telegram_label} 
            onChange={handleChange}
            placeholder="Chat on Telegram"
          />
          <FormField 
            label="Telegram Username" 
            name="telegram"
            value={formData.telegram} 
            onChange={handleChange}
            placeholder="muru_skincare"
          />
          <FormField 
            label="Telegram URL" 
            name="telegram_url"
            value={formData.telegram_url} 
            onChange={handleChange}
            placeholder="https://t.me/muru_skincare"
          />
        </div>
      </SectionWrapper>

      {/* DIRECT CONTACT */}
      <SectionWrapper title="Direct Contact" icon={Phone}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Phone Number" 
            name="phone"
            value={formData.phone} 
            onChange={handleChange}
            placeholder="+855 12 345 678"
          />
          <FormField 
            label="Email Address" 
            name="email"
            value={formData.email} 
            onChange={handleChange}
            placeholder="hello@muru.com"
          />
          <div className="md:col-span-2">
            <FormField 
              label="Location / Address" 
              name="address"
              type="textarea"
              value={formData.address} 
              onChange={handleChange}
              placeholder="No. 123, Street 456, Phnom Penh, Cambodia"
              rows={2}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* SOCIAL MEDIA */}
      <SectionWrapper title="Social Media Links" icon={InstagramIcon}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Instagram URL" 
            name="instagram"
            value={formData.instagram} 
            onChange={handleChange}
            placeholder="https://instagram.com/muru.official"
          />
          <FormField 
            label="Facebook URL" 
            name="facebook"
            value={formData.facebook} 
            onChange={handleChange}
            placeholder="https://facebook.com/muru.skincare"
          />
          <FormField 
            label="TikTok URL" 
            name="tiktok"
            value={formData.tiktok} 
            onChange={handleChange}
            placeholder="https://tiktok.com/@muru_beauty"
          />
          <FormField 
            label="YouTube URL" 
            name="youtube"
            value={formData.youtube} 
            onChange={handleChange}
            placeholder="https://youtube.com/@muru_skincare"
          />
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ContactManagement;
