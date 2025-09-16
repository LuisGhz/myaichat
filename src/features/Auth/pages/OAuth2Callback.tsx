import { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "shared/hooks/useAuth";

export const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { validateTokenWithBackend } = useAuth();

  const validateTokenAndRedirect = useCallback(
    async (token: string) => {
      try {
        const response = await validateTokenWithBackend(token);
        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            navigate("/", { replace: true });
          } else {
            console.error("❌ Token validation failed:", data.message);
            localStorage.removeItem("auth_token");
            navigate("/auth/login?error=invalid_token");
          }
        } else {
          console.error("❌ Token validation request failed");
          localStorage.removeItem("auth_token");
          navigate("/auth/login?error=validation_failed");
        }
      } catch (error) {
        console.error("❌ Error validating token:", error);
        localStorage.removeItem("auth_token");
        navigate("/auth/login?error=network_error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error) {
      // Handle authentication error from backend
      console.error("OAuth2 authentication error:", error, message);

      // Redirect to login with error message
      const errorParams = new URLSearchParams();
      errorParams.set("error", error);
      if (message) errorParams.set("message", message);

      navigate(`/auth/login?${errorParams.toString()}`);
      return;
    }

    if (token) {
      // Store JWT token from backend
      localStorage.setItem("auth_token", token);

      // Validate the token by calling the backend
      validateTokenAndRedirect(token);
    } else {
      // No token received - this shouldn't happen
      console.warn("OAuth2 callback without token or error");
      navigate("/auth/login?error=no_token");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, validateTokenAndRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">
          Processing authentication...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we complete your login
        </p>
      </div>
    </div>
  );
};
