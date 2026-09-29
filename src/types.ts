export type CategoryType = 
  | 'all'
  | 'buttons'
  | 'cards'
  | 'text'
  | 'cursor'
  | 'backgrounds'
  | '3d'
  | 'navs'
  | 'shaders';

export interface UIComponent {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  badge: 'NEW' | 'PRO' | 'TRENDING' | 'POPULAR';
  tags: string[];
  dependencies: string[];
  code: {
    react: string;
    tailwind: string;
    vanilla: string;
  };
  customizable?: {
    supportsGlowColor?: boolean;
    supportsSpeed?: boolean;
    supportsIntensity?: boolean;
  };
}
