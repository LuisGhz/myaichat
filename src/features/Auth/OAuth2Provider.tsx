import { ReactNode } from 'react';
import { AuthProvider } from 'react-oauth2-code-pkce';

// GitHub OAuth2 Configuration
const authConfig = {
  clientId: 'Ov23liHTQsIFYujBnhQ0', // Your GitHub Client ID
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  redirectUri: 'http://localhost:8080/login/oauth2/code/github', // Backend callback URL
  scope: 'user:email read:user',
  clearURL: true,
  onAccessTokenExpiry: (refreshAccessToken: () => void) => refreshAccessToken(),
  autoRefresh: true,
};

interface OAuth2ProviderProps {
  children: ReactNode;
}

export const OAuth2Provider = ({ children }: OAuth2ProviderProps) => {
  return (
    <AuthProvider authConfig={authConfig}>
      {children}
    </AuthProvider>
  );
};
