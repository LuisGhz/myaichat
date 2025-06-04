import { useAppIsOfflineStore } from "store/useAppStore";

export const OfflineMessage = () => {
  const isOffline = useAppIsOfflineStore();

  if (!isOffline) return null;

  return (
    <>
      <div className="relative top-0 left-0 w-full bg-gray-800 text-white p-4 text-center z-100">
        You are now using the app in offline mode. Some features may be limited.
      </div>
    </>
  );
};
