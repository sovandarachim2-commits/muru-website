import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../../components/Layout';
import { Button, FormField, SectionWrapper, SkeletonForm } from '../../components/Common';
import { 
  Save, 
  ExternalLink, 
  Layout, 
  Star, 
  Type, 
  MessageSquare
} from 'lucide-react';
import { adminContentService } from '../../api/services/adminContentService';
import { adminProductService } from '../../api/services/adminProductService';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import { cn } from '../../api/utils';

const HomepageManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const { t } = useLanguage();
  const [sections, setSections] = useState({
    hero: { title: '', subtitle: '', content: '', button_text: '', button_link: '', extra_data: { label: '' } },
    signature: { title: '', subtitle: '', extra_data: { product_ids: [] } },
    story: { title: '', content: '', button_text: '', button_link: '' },
    cta: { title: '', content: '', button_text: '' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, productsRes] = await Promise.all([
          adminContentService.getHomepage(),
          adminProductService.getAll({ status: 'active' })
        ]);

        if (sectionsRes.data) {
          const newSections = { ...sections };
          Object.keys(sectionsRes.data).forEach(key => {
            if (newSections[key]) {
              newSections[key] = { ...newSections[key], ...sectionsRes.data[key] };
            }
          });
          setSections(newSections);
        }
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        toast.error(t('admin.loadHomepageError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (section, field, value) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleExtraChange = (section, field, value) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        extra_data: {
          ...prev[section].extra_data,
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.keys(sections).map(key => ({
        section_key: key,
        ...sections[key]
      }));
      await adminContentService.updateHomepage({ sections: payload });
      toast.success(t('admin.homepageSaved'));
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      toast.error(t('admin.homepageSaveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonForm fields={10} />;

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle 
          title={t('admin.homepageTitle')} 
          subtitle={t('admin.homepageSubtitle')} 
          className="mb-0"
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => window.open('/', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" /> {t('admin.preview')}
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            {!saving && <><Save className="w-4 h-4 mr-2" /> {t('admin.saveChanges')}</>}
          </Button>
        </div>
      </div>

      {/* HERO SECTION */}
      <SectionWrapper title={t('admin.heroSection')} icon={Layout}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label={t('admin.smallLabel')} 
            value={sections.hero.extra_data?.label || ''} 
            onChange={(e) => handleExtraChange('hero', 'label', e.target.value)}
            placeholder={t('admin.heroLabelPlaceholder')}
          />
          <FormField 
            label={t('admin.mainHeading')} 
            value={sections.hero.title} 
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
            placeholder={t('admin.heroTitlePlaceholder')}
          />
          <div className="md:col-span-2">
            <FormField 
              label={t('admin.subtitle')} 
              type="textarea"
              value={sections.hero.subtitle} 
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              placeholder={t('admin.heroSubtitlePlaceholder')}
              rows={2}
            />
          </div>
          <FormField 
            label={t('admin.buttonText')} 
            value={sections.hero.button_text} 
            onChange={(e) => handleChange('hero', 'button_text', e.target.value)}
            placeholder={t('admin.heroButtonPlaceholder')}
          />
          <FormField 
            label={t('admin.buttonLink')} 
            value={sections.hero.button_link} 
            onChange={(e) => handleChange('hero', 'button_link', e.target.value)}
            placeholder={t('admin.heroLinkPlaceholder')}
          />
        </div>
      </SectionWrapper>

      {/* SIGNATURE PRODUCTS */}
      <SectionWrapper title={t('admin.signatureProducts')} icon={Star}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              label={t('admin.sectionHeading')} 
              value={sections.signature.title} 
              onChange={(e) => handleChange('signature', 'title', e.target.value)}
              placeholder={t('admin.sigHeadingPlaceholder')}
            />
            <FormField 
              label={t('admin.sectionSubtitle')} 
              value={sections.signature.subtitle} 
              onChange={(e) => handleChange('signature', 'subtitle', e.target.value)}
              placeholder={t('admin.sigSubtitlePlaceholder')}
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-muru-text-secondary">{t('admin.selectedFeaturedProducts')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => {
                    const currentIds = sections.signature.extra_data?.product_ids || [];
                    const newIds = currentIds.includes(product.id)
                      ? currentIds.filter(id => id !== product.id)
                      : [...currentIds, product.id];
                    handleExtraChange('signature', 'product_ids', newIds);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                    (sections.signature.extra_data?.product_ids || []).includes(product.id)
                      ? "border-muru-pink bg-muru-pink-soft/30 text-muru-pink shadow-sm shadow-muru-pink/10"
                      : "border-muru-border bg-white text-muru-text-main hover:border-muru-pink/50"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    {product.primary_image && <img src={product.primary_image.url} className="w-full h-full object-cover" alt={product.name} />}
                  </div>
                  <span className="font-bold text-xs truncate">{product.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* BRAND STORY */}
      <SectionWrapper title={t('admin.brandStory')} icon={Type}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField 
              label={t('admin.heading')} 
              value={sections.story.title} 
              onChange={(e) => handleChange('story', 'title', e.target.value)}
              placeholder={t('admin.storyHeadingPlaceholder')}
            />
          </div>
          <div className="md:col-span-2">
            <FormField 
              label={t('admin.description')} 
              type="textarea"
              value={sections.story.content} 
              onChange={(e) => handleChange('story', 'content', e.target.value)}
              placeholder={t('admin.storyDescPlaceholder')}
              rows={5}
            />
          </div>
          <FormField 
            label={t('admin.buttonText')} 
            value={sections.story.button_text} 
            onChange={(e) => handleChange('story', 'button_text', e.target.value)}
            placeholder={t('admin.storyButtonPlaceholder')}
          />
          <FormField 
            label={t('admin.buttonLink')} 
            value={sections.story.button_link} 
            onChange={(e) => handleChange('story', 'button_link', e.target.value)}
            placeholder={t('admin.storyLinkPlaceholder')}
          />
        </div>
      </SectionWrapper>

      {/* TELEGRAM CTA */}
      <SectionWrapper title={t('admin.telegramCta')} icon={MessageSquare}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label={t('admin.heading')} 
            value={sections.cta.title} 
            onChange={(e) => handleChange('cta', 'title', e.target.value)}
            placeholder={t('admin.ctaHeadingPlaceholder')}
          />
          <FormField 
            label={t('admin.buttonText')} 
            value={sections.cta.button_text} 
            onChange={(e) => handleChange('cta', 'button_text', e.target.value)}
            placeholder={t('admin.ctaButtonPlaceholder')}
          />
          <div className="md:col-span-2">
            <FormField 
              label={t('admin.description')} 
              type="textarea"
              value={sections.cta.content} 
              onChange={(e) => handleChange('cta', 'content', e.target.value)}
              placeholder={t('admin.ctaDescPlaceholder')}
              rows={3}
            />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HomepageManagement;
