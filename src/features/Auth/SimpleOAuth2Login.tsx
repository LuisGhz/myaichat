import { useSearchParams } from "react-router";

export const SimpleOAuth2Login = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  const handleGitHubLogin = () => {
    // Use your backend's OAuth2 authorization endpoint
    let api = import.meta.env.VITE_API_URL as string;
    if (api.endsWith("/myaichat/api"))
      api = api.replace("/myaichat/api", "/myaichat");
    else if (api.endsWith("/api")) api = api.replace("/api", "");
    console.log(`${api}/oauth2/authorization/github`);
    window.location.href = `${api}/oauth2/authorization/github`;
  };

  const getErrorMessage = () => {
    if (!error) return null;

    switch (error) {
      case "oauth_failed":
        return "GitHub authentication failed. Please try again.";
      case "processing_failed":
        return "Error processing authentication. Please try again.";
      case "invalid_token":
        return "Authentication token is invalid. Please login again.";
      case "validation_failed":
        return "Token validation failed. Please try again.";
      case "network_error":
        return "Network error. Please check your connection and try again.";
      case "no_token":
        return "Authentication incomplete. Please try again.";
      default:
        return message || "An error occurred during authentication.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cop-3">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to MyAIChat
          </h2>
          <p className="mt-2 text-center text-sm text-white">
            Continue with your GitHub account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{getErrorMessage()}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={handleGitHubLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
