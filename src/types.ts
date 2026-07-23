export interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  colorMode: 'cyan-purple' | 'magenta-pink' | 'matrix-green' | 'multi-glow';
  density: number;
  distortion: number;
  noise: number;
}

export type SectionId = 'hero' | 'portfolio' | 'testimonials' | 'labs' | 'contact';

export interface Section {
  id: SectionId;
  index: string;
  label: string;
  title: string;
  subtitle?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  client: string;
  year: string;
  tags: string[];
  mockStats: { label: string; value: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}
