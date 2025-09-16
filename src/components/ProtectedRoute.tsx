import { ReactNode, useEffect } from "react";
import { useAuth } from "shared/hooks/useAuth";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { validateExistingToken } = useAuth();

  useEffect(() => {
    validateExistingToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
