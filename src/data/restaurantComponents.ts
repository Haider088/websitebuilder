import { RestaurantComponent } from '../types';

export const restaurantComponents: RestaurantComponent[] = [
  // Layout Components - Container Components (New)
  {
    id: 'row-container',
    name: 'Row Container',
    category: 'layout',
    description: 'Horizontal container for side-by-side components',
    thumbnail: '⬌',
    defaultProps: {
      isContainer: true,
      acceptsChildren: true,
      backgroundColor: 'transparent'
    }
  },
  {
    id: 'grid-container',
    name: 'Grid Container',
    category: 'layout',
    description: 'Grid layout with 2, 3, or 4 columns',
    thumbnail: '▦',
    defaultProps: {
      isContainer: true,
      acceptsChildren: true,
      backgroundColor: 'transparent'
    }
  },
  {
    id: 'container',
    name: 'Container',
    category: 'layout',
    description: 'Container for organizing other components',
    thumbnail: '📦',
    defaultProps: {
      isContainer: true,
      padding: 'medium',
      backgroundColor: 'transparent'
    }
  },
  {
    id: 'hero-full',
    name: 'Hero - Full Width',
    category: 'layout',
    description: 'Full-width hero section with background image and text overlay',
    thumbnail: '🖼️',
    defaultProps: {
      title: 'Welcome to Our Restaurant',
      subtitle: 'Experience culinary excellence',
      buttonText: 'View Menu',
      backgroundImage: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYwNjk1NDM3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  },
  {
    id: 'hero-split',
    name: 'Hero - Split',
    category: 'layout',
    description: 'Split hero with image on one side and content on the other',
    thumbnail: '📱',
    defaultProps: {
      title: 'Authentic Flavors',
      description: 'Discover our signature dishes',
      imagePosition: 'right',
      imageUrl: 'food dishes'
    }
  },
  {
    id: 'two-column',
    name: 'Two Column',
    category: 'layout',
    description: 'Two column layout for content and images',
    thumbnail: '📊',
    defaultProps: {
      alignment: 'center',
      isContainer: true,
      acceptsChildren: true
    }
  },
  {
    id: 'three-column',
    name: 'Three Column',
    category: 'layout',
    description: 'Three column grid layout',
    thumbnail: '▦',
    defaultProps: {
      columns: 3
    }
  },
  
  // Content Components
  {
    id: 'text-block',
    name: 'Text Block',
    category: 'content',
    description: 'Rich text content block with heading and paragraph',
    thumbnail: '📝',
    defaultProps: {
      heading: 'Our Story',
      content: 'Share your restaurant\'s story and values...'
    }
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    category: 'content',
    description: 'Responsive photo gallery with grid layout',
    thumbnail: '🖼️',
    defaultProps: {
      columns: 3,
      spacing: 'medium'
    }
  },
  {
    id: 'video-embed',
    name: 'Video Embed',
    category: 'content',
    description: 'Embedded video player',
    thumbnail: '🎥',
    defaultProps: {
      videoUrl: '',
      autoplay: false
    }
  },
  
  // Restaurant Components
  {
    id: 'menu-grid',
    name: 'Menu Grid',
    category: 'restaurant',
    description: 'Menu items displayed in a grid with filtering',
    thumbnail: '🍽️',
    defaultProps: {
      categories: ['Appetizers', 'Main Course', 'Desserts', 'Beverages'],
      showPrices: true,
      showImages: true
    }
  },
  {
    id: 'menu-list',
    name: 'Menu List',
    category: 'restaurant',
    description: 'Traditional menu list with categories',
    thumbnail: '📋',
    defaultProps: {
      layout: 'list',
      showDescriptions: true
    }
  },
  {
    id: 'reservations',
    name: 'Reservation Form',
    category: 'restaurant',
    description: 'Table reservation form with date and time picker',
    thumbnail: '📅',
    defaultProps: {
      fields: ['name', 'email', 'phone', 'date', 'time', 'guests']
    }
  },
  {
    id: 'hours',
    name: 'Opening Hours',
    category: 'restaurant',
    description: 'Display restaurant operating hours',
    thumbnail: '🕐',
    defaultProps: {
      days: [
        { day: 'Monday - Friday', hours: '11:00 AM - 10:00 PM' },
        { day: 'Saturday - Sunday', hours: '10:00 AM - 11:00 PM' }
      ]
    }
  },
  {
    id: 'contact-info',
    name: 'Contact Info',
    category: 'restaurant',
    description: 'Business contact information display',
    thumbnail: '📞',
    defaultProps: {
      phone: '(555) 123-4567',
      email: 'info@restaurant.com',
      address: '123 Main Street, City, State 12345'
    }
  },
  {
    id: 'location-map',
    name: 'Location Map',
    category: 'restaurant',
    description: 'Interactive map showing restaurant location',
    thumbnail: '🗺️',
    defaultProps: {
      address: '123 Main Street',
      showDirections: true
    }
  },
  {
    id: 'chef-profile',
    name: 'Chef Profile',
    category: 'restaurant',
    description: 'Chef biography and photo',
    thumbnail: '👨‍🍳',
    defaultProps: {
      name: 'Chef Name',
      bio: 'Meet our talented chef...',
      specialties: []
    }
  },
  
  // Interactive Components
  {
    id: 'testimonials',
    name: 'Testimonials',
    category: 'interactive',
    description: 'Customer reviews carousel',
    thumbnail: '💬',
    defaultProps: {
      layout: 'carousel',
      showRating: true
    }
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'interactive',
    description: 'General contact form',
    thumbnail: '✉️',
    defaultProps: {
      fields: ['name', 'email', 'subject', 'message']
    }
  },
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    category: 'interactive',
    description: 'Email newsletter subscription form',
    thumbnail: '📬',
    defaultProps: {
      title: 'Stay Updated',
      placeholder: 'Enter your email'
    }
  },
  {
    id: 'social-links',
    name: 'Social Media Links',
    category: 'interactive',
    description: 'Social media icon links',
    thumbnail: '🔗',
    defaultProps: {
      platforms: ['facebook', 'instagram', 'twitter']
    }
  },
  
  // Templates
  {
    id: 'template-modern',
    name: 'Modern Restaurant',
    category: 'templates',
    description: 'Complete modern restaurant website template',
    thumbnail: '🎨',
    defaultProps: {
      style: 'modern'
    }
  },
  {
    id: 'template-classic',
    name: 'Classic Bistro',
    category: 'templates',
    description: 'Traditional bistro website template',
    thumbnail: '🍷',
    defaultProps: {
      style: 'classic'
    }
  },
  {
    id: 'template-minimal',
    name: 'Minimalist',
    category: 'templates',
    description: 'Clean minimal restaurant template',
    thumbnail: '⚪',
    defaultProps: {
      style: 'minimal'
    }
  }
];
