import { useOAuth2Hook } from 'hooks/auth/useOAuth2';

interface OAuth2UserProfileProps {
  className?: string;
}

export const OAuth2UserProfile = ({ className = '' }: OAuth2UserProfileProps) => {
  const { token, logOut } = useOAuth2Hook();

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    logOut();
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {/* You can replace this with actual user avatar */}
            U
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {/* You can extract user info from token if needed */}
            GitHub User
          </span>
          <span className="text-xs text-gray-500">
            Authenticated
          </span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};
