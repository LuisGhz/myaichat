import { useEffect, useState } from "react";

export const useNetworkState = () => {
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const handleChange = (isOff: boolean) => () => setIsOffline(isOff);
    window.addEventListener("online", handleChange(false));
    window.addEventListener("offline", handleChange(true));

    if (!navigator.onLine) handleChange(true)();

    return () => {
      window.removeEventListener("online", handleChange(false));
      window.removeEventListener("offline", handleChange(true));
    };
  }, []);

  return { isOffline };
};
