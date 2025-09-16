import { useSearchParams } from "react-router";

export const LoginErrors = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  if (error) {
    return (
      <div className="mt-4">
        <p className="text-red-600">{message || "An error occurred"}</p>
      </div>
    );
  }

  return null;
};
