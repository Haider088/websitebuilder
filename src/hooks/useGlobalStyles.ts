import { useEffect } from 'react';
import { GlobalSettings } from '../types';

const fontFamilyMap: Record<string, string> = {
  system: 'system-ui, -apple-system, sans-serif',
  inter: "'Inter', sans-serif",
  playfair: "'Playfair Display', serif",
  lora: "'Lora', serif",
  montserrat: "'Montserrat', sans-serif",
  roboto: "'Roboto', sans-serif",
  poppins: "'Poppins', sans-serif",
};

export function useGlobalStyles(settings: GlobalSettings) {
  useEffect(() => {
    const root = document.documentElement;

    // Apply typography
    root.style.setProperty('--font-size', settings.typography.baseFontSize);
    root.style.setProperty(
      '--font-heading',
      fontFamilyMap[settings.typography.headingFont] || fontFamilyMap.system
    );
    root.style.setProperty(
      '--font-body',
      fontFamilyMap[settings.typography.bodyFont] || fontFamilyMap.system
    );

    // Apply colors (convert to CSS custom properties)
    root.style.setProperty('--brand-primary', settings.branding.primaryColor);
    root.style.setProperty('--brand-secondary', settings.branding.secondaryColor);
    root.style.setProperty('--brand-accent', settings.branding.accentColor);

    // Update body styles
    document.body.style.fontFamily = fontFamilyMap[settings.typography.bodyFont];
    document.body.style.fontSize = settings.typography.baseFontSize;
    document.body.style.lineHeight = settings.typography.lineHeight;

    // Load Google Fonts if needed
    const fontsToLoad = new Set<string>();
    if (settings.typography.headingFont !== 'system') {
      fontsToLoad.add(settings.typography.headingFont);
    }
    if (settings.typography.bodyFont !== 'system') {
      fontsToLoad.add(settings.typography.bodyFont);
    }

    if (fontsToLoad.size > 0) {
      const fontNames = Array.from(fontsToLoad)
        .map((font) => {
          // Convert font key to proper name
          const nameMap: Record<string, string> = {
            inter: 'Inter',
            playfair: 'Playfair+Display',
            lora: 'Lora',
            montserrat: 'Montserrat',
            roboto: 'Roboto',
            poppins: 'Poppins',
          };
          return nameMap[font];
        })
        .filter(Boolean)
        .join('&family=');

      // Check if font link already exists
      const existingLink = document.getElementById('google-fonts');
      if (existingLink) {
        existingLink.remove();
      }

      // Add Google Fonts link
      const link = document.createElement('link');
      link.id = 'google-fonts';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontNames}&display=swap`;
      document.head.appendChild(link);
    }
  }, [settings]);
}
