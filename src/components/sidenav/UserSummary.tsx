import { useAuthState } from "store/app/AuthStore";

export const UserSummary = () => {
  const { user } = useAuthState();

  if (!user) return null;

  return (
    <div className="flex gap-3 px-2.5">
      <img className="w-12 rounded-full" src={user.avatarUrl} alt={user.name} />
      <div className="grow">
        <p
          className="app-text truncate whitespace-nowrap overflow-hidden mb-1"
          title={user.email}
        >
          {user.email}
        </p>
        <div className="text-end">
          <button
            className="!bg-red-500 text-white py-0.5 px-2 rounded-sm text-xs cursor-pointer"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
