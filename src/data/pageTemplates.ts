import { CanvasComponent } from '../types';

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'homepage' | 'menu' | 'about' | 'contact' | 'gallery';
  thumbnail: string;
  components: Omit<CanvasComponent, 'id'>[];
}

export const pageTemplates: PageTemplate[] = [
  {
    id: 'classic-homepage',
    name: 'Classic Homepage',
    description: 'Full-width hero with menu preview and testimonials',
    category: 'homepage',
    thumbnail: '🏠',
    components: [
      {
        componentId: 'hero-full',
        name: 'Hero Section',
        category: 'restaurant',
        props: {
          title: 'Welcome to Our Restaurant',
          subtitle: 'Experience culinary excellence',
          buttonText: 'View Menu',
          overlayOpacity: 50,
          padding: 'none',
          visible: true,
          locked: false,
        },
        position: 0,
      },
      {
        componentId: 'text-block',
        name: 'About Us',
        category: 'content',
        props: {
          heading: 'Our Story',
          content: 'Share your restaurant\'s unique story and culinary philosophy...',
          textAlign: 'center',
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 1,
      },
      {
        componentId: 'menu-grid',
        name: 'Featured Menu',
        category: 'restaurant',
        props: {
          showImages: true,
          showPrices: true,
          categories: ['Featured', 'Appetizers', 'Main Course', 'Desserts'],
          padding: 'large',
          backgroundColor: 'muted',
          visible: true,
          locked: false,
        },
        position: 2,
      },
      {
        componentId: 'testimonials',
        name: 'Customer Reviews',
        category: 'restaurant',
        props: {
          showRating: true,
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 3,
      },
    ],
  },
  {
    id: 'split-homepage',
    name: 'Modern Split Layout',
    description: 'Split hero with image gallery and contact info',
    category: 'homepage',
    thumbnail: '✨',
    components: [
      {
        componentId: 'hero-split',
        name: 'Hero Section',
        category: 'restaurant',
        props: {
          title: 'Authentic Flavors',
          description: 'Discover our signature dishes made with fresh, locally-sourced ingredients',
          imagePosition: 'right',
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 0,
      },
      {
        componentId: 'image-gallery',
        name: 'Food Gallery',
        category: 'content',
        props: {
          columns: 3,
          padding: 'medium',
          backgroundColor: 'white',
          visible: true,
          locked: false,
        },
        position: 1,
      },
      {
        componentId: 'two-column',
        name: 'Hours & Contact',
        category: 'layout',
        props: {
          padding: 'large',
          backgroundColor: 'muted',
          visible: true,
          locked: false,
        },
        position: 2,
      },
    ],
  },
  {
    id: 'full-menu-page',
    name: 'Complete Menu Page',
    description: 'Menu list with categories and pricing',
    category: 'menu',
    thumbnail: '📋',
    components: [
      {
        componentId: 'text-block',
        name: 'Menu Header',
        category: 'content',
        props: {
          heading: 'Our Menu',
          content: 'Carefully crafted dishes using the finest ingredients',
          textAlign: 'center',
          padding: 'medium',
          visible: true,
          locked: false,
        },
        position: 0,
      },
      {
        componentId: 'menu-list',
        name: 'Menu Items',
        category: 'restaurant',
        props: {
          showDescriptions: true,
          padding: 'large',
          width: 'lg',
          visible: true,
          locked: false,
        },
        position: 1,
      },
    ],
  },
  {
    id: 'menu-grid-page',
    name: 'Visual Menu Grid',
    description: 'Grid layout with photos and filters',
    category: 'menu',
    thumbnail: '🍽️',
    components: [
      {
        componentId: 'text-block',
        name: 'Menu Title',
        category: 'content',
        props: {
          heading: 'Explore Our Menu',
          content: 'Browse our selection of delicious dishes',
          textAlign: 'center',
          padding: 'medium',
          visible: true,
          locked: false,
        },
        position: 0,
      },
      {
        componentId: 'menu-grid',
        name: 'Menu Grid',
        category: 'restaurant',
        props: {
          showImages: true,
          showPrices: true,
          categories: ['All', 'Appetizers', 'Main Course', 'Desserts', 'Drinks'],
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 1,
      },
    ],
  },
  {
    id: 'about-page',
    name: 'About Us Page',
    description: 'Story, chef profile, and gallery',
    category: 'about',
    thumbnail: '👨‍🍳',
    components: [
      {
        componentId: 'text-block',
        name: 'Our Story',
        category: 'content',
        props: {
          heading: 'About Our Restaurant',
          content: 'Tell the story of your restaurant, your passion for food, and what makes you unique...',
          padding: 'large',
          width: 'lg',
          visible: true,
          locked: false,
        },
        position: 0,
      },
      {
        componentId: 'chef-profile',
        name: 'Meet Our Chef',
        category: 'restaurant',
        props: {
          name: 'Chef Name',
          bio: 'Share your chef\'s background, training, and culinary expertise...',
          specialties: ['French Cuisine', 'Pastry', 'Farm to Table'],
          padding: 'large',
          backgroundColor: 'muted',
          visible: true,
          locked: false,
        },
        position: 1,
      },
      {
        componentId: 'image-gallery',
        name: 'Restaurant Photos',
        category: 'content',
        props: {
          columns: 4,
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 2,
      },
    ],
  },
  {
    id: 'contact-page',
    name: 'Contact & Reservations',
    description: 'Contact form, location, and hours',
    category: 'contact',
    thumbnail: '📞',
    components: [
      {
        componentId: 'text-block',
        name: 'Contact Header',
        category: 'content',
        props: {
          heading: 'Get in Touch',
          content: 'We\'d love to hear from you',
          textAlign: 'center',
          padding: 'medium',
          visible: true,
          locked: false,
        },
        position: 0,
      },
      {
        componentId: 'two-column',
        name: 'Info & Form',
        category: 'layout',
        props: {
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 1,
      },
      {
        componentId: 'reservations',
        name: 'Reservation Form',
        category: 'restaurant',
        props: {
          padding: 'large',
          backgroundColor: 'muted',
          visible: true,
          locked: false,
        },
        position: 2,
      },
      {
        componentId: 'location-map',
        name: 'Location Map',
        category: 'restaurant',
        props: {
          address: '123 Main Street, Your City',
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 3,
      },
    ],
  },
  {
    id: 'gallery-page',
    name: 'Photo Gallery',
    description: 'Showcase your restaurant and dishes',
    category: 'gallery',
    thumbnail: '📸',
    components: [
      {
        componentId: 'text-block',
        name: 'Gallery Title',
        category: 'content',
        props: {
          heading: 'Gallery',
          content: 'Take a visual tour of our restaurant',
          textAlign: 'center',
          padding: 'medium',
          visible: true,
          locked: false,
        },
        position: 0,
      },
      {
        componentId: 'image-gallery',
        name: 'Photo Grid',
        category: 'content',
        props: {
          columns: 4,
          padding: 'large',
          visible: true,
          locked: false,
        },
        position: 1,
      },
    ],
  },
];

export function getTemplatesByCategory(category: PageTemplate['category']) {
  return pageTemplates.filter((template) => template.category === category);
}

export function getTemplateById(id: string) {
  return pageTemplates.find((template) => template.id === id);
}
