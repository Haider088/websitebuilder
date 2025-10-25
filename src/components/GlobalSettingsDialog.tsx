import { Settings2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { GlobalSettings } from '../types';
import { Separator } from './ui/separator';

interface GlobalSettingsDialogProps {
  settings: GlobalSettings;
  onUpdateSettings: (settings: Partial<GlobalSettings>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const fontFamilies = [
  { value: 'inter', label: 'Inter (Modern Sans-serif)' },
  { value: 'system', label: 'System UI (Default)' },
  { value: 'playfair', label: 'Playfair Display (Elegant Serif)' },
  { value: 'lora', label: 'Lora (Classic Serif)' },
  { value: 'montserrat', label: 'Montserrat (Geometric Sans)' },
  { value: 'roboto', label: 'Roboto (Clean Sans-serif)' },
  { value: 'poppins', label: 'Poppins (Rounded Sans)' },
];

const colorPresets = [
  { name: 'Restaurant Classic', primary: '#8B4513', secondary: '#D4AF37', accent: '#2C1810' },
  { name: 'Modern Minimalist', primary: '#1A1A1A', secondary: '#F5F5F5', accent: '#666666' },
  { name: 'Italian Bistro', primary: '#D32F2F', secondary: '#388E3C', accent: '#FFC107' },
  { name: 'Ocean Fresh', primary: '#006064', secondary: '#00ACC1', accent: '#FFB300' },
  { name: 'Elegant Gold', primary: '#1A1A1A', secondary: '#C9A961', accent: '#4A4A4A' },
];

export function GlobalSettingsDialog({ 
  settings, 
  onUpdateSettings,
  open,
  onOpenChange 
}: GlobalSettingsDialogProps) {
  const updateBranding = (key: string, value: string) => {
    onUpdateSettings({
      branding: { ...settings.branding, [key]: value },
    });
  };

  const updateTypography = (key: string, value: string) => {
    onUpdateSettings({
      typography: { ...settings.typography, [key]: value },
    });
  };

  const updateContact = (key: string, value: string) => {
    onUpdateSettings({
      contact: { ...settings.contact, [key]: value },
    });
  };

  const updateSocial = (platform: string, url: string) => {
    onUpdateSettings({
      social: { ...settings.social, [platform]: url },
    });
  };

  const updateBusinessHours = (day: string, hours: string) => {
    onUpdateSettings({
      businessHours: { ...settings.businessHours, [day]: hours },
    });
  };

  const updateNavigation = (items: typeof settings.navigation.items) => {
    onUpdateSettings({
      navigation: { ...settings.navigation, items },
    });
  };

  const updateSEO = (key: string, value: string) => {
    onUpdateSettings({
      seo: { ...settings.seo, [key]: value },
    });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    onUpdateSettings({
      branding: {
        ...settings.branding,
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
        accentColor: preset.accent,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && !onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings2 className="w-4 h-4" />
            Settings
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Global Site Settings</DialogTitle>
          <DialogDescription>
            Configure site-wide branding, typography, and business information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="branding" className="w-full">
          <div className="overflow-x-auto scrollbar-hide pb-2">
            <TabsList className="inline-flex w-auto min-w-full">
              <TabsTrigger value="branding" className="flex-1 min-w-[100px]">Branding</TabsTrigger>
              <TabsTrigger value="typography" className="flex-1 min-w-[100px]">Typography</TabsTrigger>
              <TabsTrigger value="contact" className="flex-1 min-w-[100px]">Contact</TabsTrigger>
              <TabsTrigger value="navigation" className="flex-1 min-w-[100px]">Navigation</TabsTrigger>
              <TabsTrigger value="hours" className="flex-1 min-w-[100px]">Hours</TabsTrigger>
              <TabsTrigger value="seo" className="flex-1 min-w-[100px]">SEO</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(90vh-200px)] mt-4">
            <div className="pr-4">
            {/* Branding Tab */}
            <TabsContent value="branding" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={settings.branding.siteName}
                    onChange={(e) => updateBranding('siteName', e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.branding.tagline}
                    onChange={(e) => updateBranding('tagline', e.target.value)}
                    placeholder="e.g., Fine Dining Experience"
                    className="mt-1.5"
                  />
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block">Color Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className="p-3 border border-border rounded-lg hover:bg-accent transition-colors text-left"
                      >
                        <div className="flex gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: preset.secondary }}
                          />
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: preset.accent }}
                          />
                        </div>
                        <p className="text-sm">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        type="color"
                        id="primary-color"
                        value={settings.branding.primaryColor}
                        onChange={(e) => updateBranding('primaryColor', e.target.value)}
                        className="w-14 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.branding.primaryColor}
                        onChange={(e) => updateBranding('primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        type="color"
                        id="secondary-color"
                        value={settings.branding.secondaryColor}
                        onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                        className="w-14 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.branding.secondaryColor}
                        onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        type="color"
                        id="accent-color"
                        value={settings.branding.accentColor}
                        onChange={(e) => updateBranding('accentColor', e.target.value)}
                        className="w-14 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.branding.accentColor}
                        onChange={(e) => updateBranding('accentColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo-text">Logo Text</Label>
                  <Input
                    id="logo-text"
                    value={settings.branding.logoText}
                    onChange={(e) => updateBranding('logoText', e.target.value)}
                    placeholder="Leave empty to use site name"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <Select
                    value={settings.typography.headingFont}
                    onValueChange={(value) => updateTypography('headingFont', value)}
                  >
                    <SelectTrigger id="heading-font" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="body-font">Body Font</Label>
                  <Select
                    value={settings.typography.bodyFont}
                    onValueChange={(value) => updateTypography('bodyFont', value)}
                  >
                    <SelectTrigger id="body-font" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="base-size">Base Font Size</Label>
                    <Select
                      value={settings.typography.baseFontSize}
                      onValueChange={(value) => updateTypography('baseFontSize', value)}
                    >
                      <SelectTrigger id="base-size" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14px">Small (14px)</SelectItem>
                        <SelectItem value="16px">Medium (16px)</SelectItem>
                        <SelectItem value="18px">Large (18px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="line-height">Line Height</Label>
                    <Select
                      value={settings.typography.lineHeight}
                      onValueChange={(value) => updateTypography('lineHeight', value)}
                    >
                      <SelectTrigger id="line-height" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.4">Tight (1.4)</SelectItem>
                        <SelectItem value="1.5">Normal (1.5)</SelectItem>
                        <SelectItem value="1.6">Relaxed (1.6)</SelectItem>
                        <SelectItem value="1.8">Loose (1.8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm mb-3">Preview:</p>
                  <div
                    style={{
                      fontFamily:
                        settings.typography.headingFont === 'system'
                          ? 'system-ui'
                          : settings.typography.headingFont,
                    }}
                  >
                    <h3 className="mb-2">The Quick Brown Fox</h3>
                  </div>
                  <div
                    style={{
                      fontFamily:
                        settings.typography.bodyFont === 'system'
                          ? 'system-ui'
                          : settings.typography.bodyFont,
                      fontSize: settings.typography.baseFontSize,
                      lineHeight: settings.typography.lineHeight,
                    }}
                  >
                    <p>
                      Welcome to our restaurant, where every dish tells a story and every
                      meal is an experience to remember.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    placeholder="contact@restaurant.com"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={settings.contact.address}
                    onChange={(e) => updateContact('address', e.target.value)}
                    placeholder="123 Main Street"
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={settings.contact.city}
                      onChange={(e) => updateContact('city', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={settings.contact.state}
                      onChange={(e) => updateContact('state', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={settings.contact.zip}
                      onChange={(e) => updateContact('zip', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block">Social Media</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="facebook" className="text-xs">
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={settings.social.facebook}
                        onChange={(e) => updateSocial('facebook', e.target.value)}
                        placeholder="https://facebook.com/yourrestaurant"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="instagram" className="text-xs">
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={settings.social.instagram}
                        onChange={(e) => updateSocial('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourrestaurant"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="twitter" className="text-xs">
                        Twitter/X
                      </Label>
                      <Input
                        id="twitter"
                        value={settings.social.twitter}
                        onChange={(e) => updateSocial('twitter', e.target.value)}
                        placeholder="https://twitter.com/yourrestaurant"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="yelp" className="text-xs">
                        Yelp
                      </Label>
                      <Input
                        id="yelp"
                        value={settings.social.yelp}
                        onChange={(e) => updateSocial('yelp', e.target.value)}
                        placeholder="https://yelp.com/biz/yourrestaurant"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Navigation Tab */}
            <TabsContent value="navigation" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Navigation Items</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    These items will appear in your site's main navigation menu
                  </p>

                  <div className="space-y-2">
                    {settings.navigation.items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item.label}
                          onChange={(e) => {
                            const newItems = [...settings.navigation.items];
                            newItems[index] = { ...item, label: e.target.value };
                            updateNavigation(newItems);
                          }}
                          placeholder="Label"
                          className="flex-1"
                        />
                        <Input
                          value={item.href}
                          onChange={(e) => {
                            const newItems = [...settings.navigation.items];
                            newItems[index] = { ...item, href: e.target.value };
                            updateNavigation(newItems);
                          }}
                          placeholder="Link (e.g., /menu)"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = settings.navigation.items.filter(
                              (_, i) => i !== index
                            );
                            updateNavigation(newItems);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      updateNavigation([
                        ...settings.navigation.items,
                        { label: 'New Item', href: '/' },
                      ]);
                    }}
                  >
                    Add Navigation Item
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Business Hours Tab */}
            <TabsContent value="hours" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Business Hours</Label>
                  <div className="space-y-3">
                    {[
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ].map((day) => (
                      <div key={day} className="flex gap-3 items-center">
                        <Label className="w-28 text-sm">{day}</Label>
                        <Input
                          value={settings.businessHours[day.toLowerCase()] || ''}
                          onChange={(e) =>
                            updateBusinessHours(day.toLowerCase(), e.target.value)
                          }
                          placeholder="e.g., 11:00 AM - 10:00 PM or Closed"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="special-hours">Special Hours / Notes</Label>
                  <Textarea
                    id="special-hours"
                    value={settings.contact.specialHours || ''}
                    onChange={(e) => updateContact('specialHours', e.target.value)}
                    placeholder="e.g., Closed on major holidays"
                    className="mt-1.5 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Configure default SEO settings for your entire site. Individual pages can override these settings in the Page Settings panel.
                  </p>
                </div>

                <div>
                  <Label htmlFor="default-meta-title">Default Meta Title</Label>
                  <Input
                    id="default-meta-title"
                    value={settings.seo?.defaultMetaTitle || ''}
                    onChange={(e) => updateSEO('defaultMetaTitle', e.target.value)}
                    placeholder={settings.branding.siteName}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Fallback title for pages without a specific meta title
                  </p>
                </div>

                <div>
                  <Label htmlFor="default-meta-description">Default Meta Description</Label>
                  <Textarea
                    id="default-meta-description"
                    value={settings.seo?.defaultMetaDescription || ''}
                    onChange={(e) => updateSEO('defaultMetaDescription', e.target.value)}
                    placeholder="Brief description of your restaurant..."
                    className="mt-1.5 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Shown in search engine results (150-160 characters recommended)
                  </p>
                </div>

                <div>
                  <Label htmlFor="default-meta-keywords">Default Keywords</Label>
                  <Input
                    id="default-meta-keywords"
                    value={settings.seo?.defaultMetaKeywords || ''}
                    onChange={(e) => updateSEO('defaultMetaKeywords', e.target.value)}
                    placeholder="restaurant, dining, food, cuisine"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Comma-separated keywords for search engines
                  </p>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="og-image">Open Graph Image URL</Label>
                  <Input
                    id="og-image"
                    value={settings.seo?.ogImage || ''}
                    onChange={(e) => updateSEO('ogImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Image displayed when sharing your site on social media (1200x630px recommended)
                  </p>
                </div>

                <div>
                  <Label htmlFor="twitter-handle">Twitter Handle</Label>
                  <Input
                    id="twitter-handle"
                    value={settings.seo?.twitterHandle || ''}
                    onChange={(e) => updateSEO('twitterHandle', e.target.value)}
                    placeholder="@yourrestaurant"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For Twitter/X cards (optional)
                  </p>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="google-analytics">Google Analytics ID</Label>
                  <Input
                    id="google-analytics"
                    value={settings.seo?.googleAnalyticsId || ''}
                    onChange={(e) => updateSEO('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Track your website traffic (optional)
                  </p>
                </div>

                <div>
                  <Label htmlFor="google-verification">Google Site Verification</Label>
                  <Input
                    id="google-verification"
                    value={settings.seo?.googleSiteVerification || ''}
                    onChange={(e) => updateSEO('googleSiteVerification', e.target.value)}
                    placeholder="Verification code from Google Search Console"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Verify your site ownership with Google (optional)
                  </p>
                </div>
              </div>
            </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
