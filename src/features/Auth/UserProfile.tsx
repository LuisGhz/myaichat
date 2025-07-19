import { useAuth } from 'hooks/auth/useAuth';

interface UserProfileProps {
  className?: string;
}

export const UserProfile = ({ className = '' }: UserProfileProps) => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex-shrink-0">
        {user.avatarUrl ? (
          <img
            className="h-8 w-8 rounded-full"
            src={user.avatarUrl}
            alt={user.name}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user.name}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {user.email}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="flex-shrink-0 text-xs text-gray-400 hover:text-white transition-colors bg-cop-1 hover:bg-cop-2 px-2 py-1 rounded"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
};
