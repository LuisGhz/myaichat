import { useSimpleAuth } from "hooks/auth/useSimpleAuth";

export const UserProfile = () => {
  const { user } = useSimpleAuth();

  return (
    <div className="user-profile text-white text-center">
      {user ? (
        <div>
          <div className="flex justify-center mt-10 mb-5">
            <img
              className="rounded-full w-24 h-24"
              src={user.avatarUrl}
              alt="User Avatar"
            />
          </div>
          <p>{user.email}</p>
          {/* Additional user information can be displayed here */}
        </div>
      ) : (
        <h1>Please log in to view your profile.</h1>
      )}
    </div>
  );
};
