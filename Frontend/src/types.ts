export interface Studio {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  displayName: string;
  bio?: string | null;
  instagram?: string | null;
  city?: string | null;
  createdAt: string;
  studio?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  styles: {
    style: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  portfolio?: {
    id: string;
    title: string;
    imageUrl: string;
  }[];
}

export interface Style {
  id: string;
  name: string;
  slug: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "ARTIST" | "ADMIN";
  isActive: boolean;
  createdAt: string;
}
