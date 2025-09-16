export interface User {
  id: string;
  email: string;
  name: string;
  roleName: "USER" | "ADMIN";
  githubLogin?: string;
  avatarUrl?: string;
}