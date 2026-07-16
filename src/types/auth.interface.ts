export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  shopId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  
  login: (email: string, phone: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, shopName: string, type: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // checkAuth: () => Promise<void>;
}