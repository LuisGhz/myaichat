import { useSearchParams } from "react-router";

export const LoginErrors = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  if (error === "invalid_token") {
    return (
      <p className="text-red-600">
        Invalid or expired token. Please log in again.
      </p>
    );
  }

  if (error === "validation_failed") {
    return (
      <p className="text-red-600">
        Validation failed. Please check your input and try again.
      </p>
    );
  }

  if (error === "network_error") {
    return (
      <p className="text-red-600">
        Network error. Please check your internet connection and try again.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600">
        {message ? message : "An unknown error occurred."}
      </p>
    );
  }

  return null;
};
