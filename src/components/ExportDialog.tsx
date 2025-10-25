import { Download, Link2, FileCode } from 'lucide-react';
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
import { Page, GlobalSettings } from '../types';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExportDialogProps {
  pages: Page[];
  siteName: string;
  globalSettings: GlobalSettings;
  onUpdateSiteName: (name: string) => void;
}

export function ExportDialog({ pages, siteName, globalSettings, onUpdateSiteName }: ExportDialogProps) {
  const [siteSettings, setSiteSettings] = useState({
    name: siteName,
    description: 'A beautiful restaurant website',
    favicon: '🍽️',
  });

  const generateHTML = () => {
    const fontFamilyMap: Record<string, string> = {
      system: 'system-ui, -apple-system, sans-serif',
      inter: "'Inter', sans-serif",
      playfair: "'Playfair Display', serif",
      lora: "'Lora', serif",
      montserrat: "'Montserrat', sans-serif",
      roboto: "'Roboto', sans-serif",
      poppins: "'Poppins', sans-serif",
    };

    const headingFont = fontFamilyMap[globalSettings.typography.headingFont] || fontFamilyMap.system;
    const bodyFont = fontFamilyMap[globalSettings.typography.bodyFont] || fontFamilyMap.system;

    // Generate complete HTML for all pages
    const htmlPages = pages.map((page) => {
      const componentsHTML = page.components
        .filter((c) => c.props?.visible !== false)
        .map((component) => {
          // Simplified HTML generation - in production you'd render actual components
          return `<section id="${component.id}" class="component-${component.componentId}">
  <!-- ${component.name} -->
  <div>Component: ${component.name}</div>
</section>`;
        })
        .join('\n');

      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${page.props?.metaDescription || siteSettings.description}">
  <title>${page.props?.metaTitle || page.name} - ${globalSettings.branding.siteName}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${siteSettings.favicon}</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-color: ${globalSettings.branding.primaryColor};
      --secondary-color: ${globalSettings.branding.secondaryColor};
      --accent-color: ${globalSettings.branding.accentColor};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: ${bodyFont}; 
      font-size: ${globalSettings.typography.baseFontSize};
      line-height: ${globalSettings.typography.lineHeight}; 
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: ${headingFont};
    }
    nav {
      background: var(--primary-color);
      padding: 1rem 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    nav a {
      color: white;
      text-decoration: none;
      font-weight: 500;
    }
    nav a:hover {
      color: var(--secondary-color);
    }
    .component-hero-full { 
      position: relative; 
      height: 400px; 
      background: var(--primary-color); 
      color: white; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
    section { padding: 2rem; }
    footer {
      background: var(--accent-color);
      color: white;
      padding: 3rem 2rem;
      margin-top: 4rem;
    }
    footer a {
      color: var(--secondary-color);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <nav>
    <strong>${globalSettings.branding.logoText || globalSettings.branding.siteName}</strong>
    ${globalSettings.navigation.items
      .map(
        (item) =>
          `<a href="${item.href}">${item.label}</a>`
      )
      .join('')}
  </nav>
  
  ${componentsHTML}
  
  <footer>
    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">${globalSettings.branding.siteName}</h3>
        <p style="color: rgba(255,255,255,0.8);">${globalSettings.branding.tagline}</p>
      </div>
      ${globalSettings.contact.phone || globalSettings.contact.email ? `
      <div>
        <h4 style="margin-bottom: 1rem;">Contact</h4>
        ${globalSettings.contact.phone ? `<p style="color: rgba(255,255,255,0.8);">${globalSettings.contact.phone}</p>` : ''}
        ${globalSettings.contact.email ? `<p style="color: rgba(255,255,255,0.8); margin-top: 0.5rem;">${globalSettings.contact.email}</p>` : ''}
        ${globalSettings.contact.address ? `<p style="color: rgba(255,255,255,0.8); margin-top: 0.5rem;">${globalSettings.contact.address}, ${globalSettings.contact.city}, ${globalSettings.contact.state} ${globalSettings.contact.zip}</p>` : ''}
      </div>
      ` : ''}
      <div>
        <h4 style="margin-bottom: 1rem;">Hours</h4>
        <p style="color: rgba(255,255,255,0.8); font-size: 0.875rem;">
          ${Object.entries(globalSettings.businessHours).slice(0, 1).map(([day, hours]) => 
            `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours}`
          ).join('<br>')}
        </p>
      </div>
    </div>
    <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.2);">
      <p>&copy; ${new Date().getFullYear()} ${globalSettings.branding.siteName}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
    });

    return htmlPages;
  };

  const handleExportHTML = () => {
    const htmlPages = generateHTML();

    // Create a zip-like structure by downloading multiple files
    htmlPages.forEach((html, index) => {
      const page = pages[index];
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${page.slug}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success('Website exported successfully!');
  };

  const handleCopyPreviewLink = () => {
    const previewUrl = `${window.location.origin}/preview/${Date.now()}`;
    navigator.clipboard.writeText(previewUrl);
    toast.success('Preview link copied to clipboard!');
  };

  const handleExportJSON = () => {
    const json = JSON.stringify({ pages, settings: siteSettings }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Project data exported!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export & Publish</DialogTitle>
          <DialogDescription>
            Export your website or generate a preview link to share
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="preview">Preview Link</TabsTrigger>
            <TabsTrigger value="settings">SEO Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer" onClick={handleExportHTML}>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary text-primary-foreground rounded-md">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-1">Export as HTML</h4>
                    <p className="text-sm text-muted-foreground">
                      Download all pages as static HTML files
                    </p>
                  </div>
                  <Button size="sm" onClick={handleExportHTML}>
                    Download
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer" onClick={handleExportJSON}>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary text-primary-foreground rounded-md">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-1">Export Project Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download project as JSON to import later
                    </p>
                  </div>
                  <Button size="sm" onClick={handleExportJSON}>
                    Download
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> The exported HTML is a simplified version. For full
                functionality, consider deploying to a hosting platform.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label>Preview URL</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={`${window.location.origin}/preview/${Date.now()}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={handleCopyPreviewLink} className="gap-2">
                    <Link2 className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Share this link to let others preview your website
                </p>
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <h4 className="text-sm mb-2">Preview Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View-only access (no editing)</li>
                  <li>• All pages accessible via navigation</li>
                  <li>• Responsive on all devices</li>
                  <li>• Link expires after 7 days</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={siteSettings.name}
                  onChange={(e) => {
                    setSiteSettings({ ...siteSettings, name: e.target.value });
                    onUpdateSiteName(e.target.value);
                  }}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={siteSettings.description}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, description: e.target.value })
                  }
                  className="mt-1.5 resize-none"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This will appear in search engine results
                </p>
              </div>

              <div>
                <Label htmlFor="favicon">Favicon (Emoji)</Label>
                <Input
                  id="favicon"
                  value={siteSettings.favicon}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, favicon: e.target.value })
                  }
                  className="mt-1.5"
                  maxLength={2}
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm mb-2">Per-Page SEO:</h4>
                <p className="text-sm text-muted-foreground">
                  Edit individual page SEO settings in the Property Inspector when no
                  component is selected
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
