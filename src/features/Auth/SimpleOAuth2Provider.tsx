import { ReactNode } from 'react';

interface SimpleOAuth2ProviderProps {
  children: ReactNode;
}

// Simple OAuth2 context for backend-handled authentication
export const SimpleOAuth2Provider = ({ children }: SimpleOAuth2ProviderProps) => {
  return <>{children}</>;
};
