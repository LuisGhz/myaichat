export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  roleName: string;
  avatarUrl?: string;
}
