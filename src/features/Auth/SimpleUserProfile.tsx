import { useSimpleAuth } from "hooks/auth/useSimpleAuth";

interface SimpleUserProfileProps {
  className?: string;
}

export const SimpleUserProfile = ({
  className = "",
}: SimpleUserProfileProps) => {
  const { isAuthenticated, user, logout } = useSimpleAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name[0].toUpperCase();
    }
    if (user?.githubLogin) {
      return user.githubLogin[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    return user?.name || user?.githubLogin || user?.email || "GitHub User";
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-3">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {getUserInitial()}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{getUserDisplayName()}</span>
          <span className="text-xs text-gray-500">Authenticated</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};
