import { LoginButton } from "../components/LoginButton";
import { LoginErrors } from "../components/LoginErrors";

export const Login = () => {
  return (
    <main className="h-dvh bg-gray-100 dark:bg-gray-950 dark:text-gray-100 flex justify-center items-center">
      <div>
        <h1 className="text-3xl font-bold">Login to MyAIChat</h1>
        <p>Continue with your GitHub account</p>
        <LoginErrors />
        <div className="mt-4">
          <LoginButton />
        </div>
      </div>
    </main>
  );
};
