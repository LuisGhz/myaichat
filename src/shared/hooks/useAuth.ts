import { useNavigate } from "react-router";
import { useAuthActions } from "store/app/AuthStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuthActions();

  const validateTokenWithBackend = async (token: string) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/auth/validate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  };

  const validateExistingToken = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.warn("No auth token found");
      navigate("/auth/login");
      return;
    }

    try {
      const response = await validateTokenWithBackend(token);
      if (!response.ok) {
        console.log("Token validation request failed");
        localStorage.removeItem("auth_token");
        navigate("/auth/login");
        return;
      }
      const data = await response.json();
      if (!(data.valid && data.user)) {
        console.log("Invalid token or no user data");
        localStorage.removeItem("auth_token");
        navigate("/auth/login");
        return;
      }

      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error validating token:", error);
    }
    return false;
  };

  return {
    validateTokenWithBackend,
    validateExistingToken,
  };
};
