import { RestaurantComponent } from '../types';
import { 
  LayoutGrid, 
  FileText, 
  Utensils, 
  MousePointer, 
  FileStack,
  Image,
  Video,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  ChefHat,
  List,
  Send,
  Bell,
  Share2
} from 'lucide-react';

interface ComponentCardProps {
  component: RestaurantComponent;
  onDragStart?: (component: RestaurantComponent) => void;
}

const componentIcons: Record<string, React.ReactNode> = {
  'hero-full': <LayoutGrid className="w-4 h-4" />,
  'hero-split': <LayoutGrid className="w-4 h-4" />,
  'two-column': <LayoutGrid className="w-4 h-4" />,
  'three-column': <LayoutGrid className="w-4 h-4" />,
  'text-block': <FileText className="w-4 h-4" />,
  'image-gallery': <Image className="w-4 h-4" />,
  'video-embed': <Video className="w-4 h-4" />,
  'menu-grid': <Utensils className="w-4 h-4" />,
  'menu-list': <List className="w-4 h-4" />,
  'reservations': <Calendar className="w-4 h-4" />,
  'hours': <Clock className="w-4 h-4" />,
  'contact-info': <Phone className="w-4 h-4" />,
  'location-map': <MapPin className="w-4 h-4" />,
  'chef-profile': <ChefHat className="w-4 h-4" />,
  'testimonials': <MessageSquare className="w-4 h-4" />,
  'contact-form': <Mail className="w-4 h-4" />,
  'newsletter': <Bell className="w-4 h-4" />,
  'social-links': <Share2 className="w-4 h-4" />,
  'template-modern': <FileStack className="w-4 h-4" />,
  'template-classic': <FileStack className="w-4 h-4" />,
  'template-minimal': <FileStack className="w-4 h-4" />,
};

export function ComponentCard({ component, onDragStart }: ComponentCardProps) {
  const icon = componentIcons[component.id] || <MousePointer className="w-4 h-4" />;
  
  return (
    <div
      draggable
      onDragStart={() => onDragStart?.(component)}
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card cursor-move hover:border-primary/50 hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate group-hover:text-primary transition-colors">{component.name}</div>
        <div className="text-xs text-muted-foreground truncate">{component.description}</div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MousePointer className="w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  );
}
