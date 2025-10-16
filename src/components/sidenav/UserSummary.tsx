import { useAuth } from "shared/hooks/useAuth";
import { useAuthState } from "store/app/AuthStore";

export const UserSummary = () => {
  const { user } = useAuthState();
  const { logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex gap-3 px-2.5">
      <img
        className="w-12 rounded-full"
        src={user.avatarUrl}
        alt={user.email}
      />
      <div className="grow">
        <p
          className="app-text truncate whitespace-nowrap overflow-hidden mb-1"
          title={user.email}
        >
          {user.email}
        </p>
        <div className="text-end">
          <button
            className="!bg-red-700 hover:!bg-red-800 text-white py-1 px-3 rounded-sm text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400 cursor-pointer"
            type="button"
            onClick={logout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
