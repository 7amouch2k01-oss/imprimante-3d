export interface ProductType {
  id: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  images: string[];
  category: string;
  featured?: boolean;
  name: string;
  description: string;
  specs?: Record<string, any>;
  technology?: string;
  speed?: string;
  buildVolume?: string;
  brand?: string;
  filamentType?: string;
}
