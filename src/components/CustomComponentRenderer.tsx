import { LiveComponentRenderer } from './LiveComponentRenderer';

interface CustomComponentRendererProps {
  name: string;
  code: string;
  description?: string;
  props?: Record<string, any>;
}

export function CustomComponentRenderer({ 
  name, 
  code, 
  description,
  props = {} 
}: CustomComponentRendererProps) {
  return (
    <LiveComponentRenderer code={code} props={props} />
  );
}
