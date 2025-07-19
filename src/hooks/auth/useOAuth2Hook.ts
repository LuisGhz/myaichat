import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

// Custom hook to use OAuth2 authentication
export function useOAuth2() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useOAuth2 must be used within OAuth2Provider');
  }
  return context;
}
