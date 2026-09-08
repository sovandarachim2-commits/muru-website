import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../../components/Layout';
import { Button, FormField, SectionWrapper, SkeletonForm } from '../../components/Common';
import { 
  Save, 
  ExternalLink, 
  Info, 
  BookOpen, 
  Trophy, 
  ShieldCheck, 
  MessageSquare,
  Upload
} from 'lucide-react';
import { adminContentService } from '../../api/services/adminContentService';
import toast from 'react-hot-toast';

const ImageUploadField = ({ label, preview, onChange }) => (
  <div className="space-y-3 md:col-span-2">
    <label className="block text-sm font-bold text-muru-text-main">{label}</label>
    <div className="flex items-center gap-5 p-4 rounded-2xl border border-muru-border bg-slate-50/50">
      <div className="w-28 h-20 rounded-xl border border-muru-border bg-white overflow-hidden flex-shrink-0">
        {preview ? <img src={preview} alt={label} className="w-full h-full object-cover" /> : null}
      </div>
      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muru-pink text-white text-sm font-semibold hover:bg-muru-pink-dark transition-colors">
        <Upload className="w-4 h-4" />
        Upload Image
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
    </div>
  </div>
);

const AboutUsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [data, setData] = useState({
    hero: { label: '', title: '', description: '', image: '' },
    story: { title: '', content: '', image: '' },
    pillars: { mission: '', values: '', promise: '' },
    quality: { title: '', description: '', image: '' },
    cta: { heading: '', explore_button: '', telegram_button: '' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminContentService.getAbout();
        if (response.data) {
          setData(prev => ({
            ...prev,
            ...response.data
          }));
          setImagePreviews({
            hero: response.data.hero?.image || '',
            story: response.data.story?.image || '',
            quality: response.data.quality?.image || ''
          });
        }
      } catch (error) {
        console.error('Error fetching About Us data:', error);
        toast.error('Failed to load About Us settings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleImageChange = (section, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFiles(prev => ({ ...prev, [section]: file }));
    setImagePreviews(prev => ({ ...prev, [section]: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      Object.entries(imageFiles).forEach(([section, file]) => {
        formData.append(`${section}_image`, file);
      });
      const response = await adminContentService.updateAbout(formData);
      if (response.data?.data) setData(response.data.data);
      setImageFiles({});
      toast.success('About Us settings saved successfully!');
    } catch (error) {
      console.error('Error saving About Us settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save About Us settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonForm fields={10} />;

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle 
          title="About Us Management" 
          subtitle="Tell your brand's story and showcase your values." 
          className="mb-0"
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => window.open('/about', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" /> Preview
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            {!saving && <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
          </Button>
        </div>
      </div>

      {/* HERO SECTION */}
      <SectionWrapper title="Hero Section" icon={Info}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Hero Label" 
            value={data.hero.label} 
            onChange={(e) => handleChange('hero', 'label', e.target.value)}
            placeholder="e.g., Since 2024"
          />
          <FormField 
            label="Hero Title" 
            value={data.hero.title} 
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
            placeholder="e.g., Redefining Natural Skincare"
          />
          <div className="md:col-span-2">
            <FormField 
              label="Hero Description" 
              type="textarea"
              value={data.hero.description} 
              onChange={(e) => handleChange('hero', 'description', e.target.value)}
              placeholder="Hero section intro..."
              rows={3}
            />
          </div>
          <ImageUploadField label="Hero Image" preview={imagePreviews.hero} onChange={(event) => handleImageChange('hero', event)} />
        </div>
      </SectionWrapper>

      {/* OUR STORY */}
      <SectionWrapper title="Our Story" icon={BookOpen}>
        <div className="space-y-6">
          <FormField 
            label="Story Title" 
            value={data.story.title} 
            onChange={(e) => handleChange('story', 'title', e.target.value)}
            placeholder="e.g., The MURU Journey"
          />
          <FormField 
            label="Story Content" 
            type="textarea"
            value={data.story.content} 
            onChange={(e) => handleChange('story', 'content', e.target.value)}
            placeholder="Share the history and inspiration behind MURU..."
            rows={8}
          />
          <ImageUploadField label="Story Image" preview={imagePreviews.story} onChange={(event) => handleImageChange('story', event)} />
        </div>
      </SectionWrapper>

      {/* BRAND PILLARS */}
      <SectionWrapper title="Brand Pillars" icon={Trophy}>
        <div className="grid grid-cols-1 gap-6">
          <FormField 
            label="Our Mission" 
            type="textarea"
            value={data.pillars.mission} 
            onChange={(e) => handleChange('pillars', 'mission', e.target.value)}
            placeholder="What is MURU's core mission?"
            rows={3}
          />
          <FormField 
            label="Our Values" 
            type="textarea"
            value={data.pillars.values} 
            onChange={(e) => handleChange('pillars', 'values', e.target.value)}
            placeholder="What values drive your brand?"
            rows={3}
          />
          <FormField 
            label="Our Promise" 
            type="textarea"
            value={data.pillars.promise} 
            onChange={(e) => handleChange('pillars', 'promise', e.target.value)}
            placeholder="What do you promise your customers?"
            rows={3}
          />
        </div>
      </SectionWrapper>

      {/* QUALITY SECTION */}
      <SectionWrapper title="Quality Section" icon={ShieldCheck}>
        <div className="space-y-6">
          <FormField 
            label="Section Title" 
            value={data.quality.title} 
            onChange={(e) => handleChange('quality', 'title', e.target.value)}
            placeholder="e.g., Uncompromising Quality"
          />
          <FormField 
            label="Quality Description" 
            type="textarea"
            value={data.quality.description} 
            onChange={(e) => handleChange('quality', 'description', e.target.value)}
            placeholder="Details about your manufacturing and ingredient standards..."
            rows={5}
          />
          <ImageUploadField label="Quality Image" preview={imagePreviews.quality} onChange={(event) => handleImageChange('quality', event)} />
        </div>
      </SectionWrapper>

      {/* CTA SECTION */}
      <SectionWrapper title="CTA Section" icon={MessageSquare}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField 
              label="CTA Heading" 
              value={data.cta.heading} 
              onChange={(e) => handleChange('cta', 'heading', e.target.value)}
              placeholder="e.g., Experience the MURU Difference"
            />
          </div>
          <FormField 
            label="Explore Button Text" 
            value={data.cta.explore_button} 
            onChange={(e) => handleChange('cta', 'explore_button', e.target.value)}
            placeholder="Explore Products"
          />
          <FormField 
            label="Telegram Button Text" 
            value={data.cta.telegram_button} 
            onChange={(e) => handleChange('cta', 'telegram_button', e.target.value)}
            placeholder="Chat on Telegram"
          />
        </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutUsManagement;
