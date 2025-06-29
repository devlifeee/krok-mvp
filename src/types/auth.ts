
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Viewer' | 'Editor' | 'Admin';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
