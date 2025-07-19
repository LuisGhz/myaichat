import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

// Custom hook to use OAuth2 authentication
export function useOAuth2Hook() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useOAuth2Hook must be used within OAuth2Provider');
  }
  return context;
}
