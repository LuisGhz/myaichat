import { usePrompts } from "hooks/usePrompts";
import { Link } from "react-router";

export const Prompts = () => {
  const { prompts } = usePrompts();

  return (
    <div className="flex flex-col gap-4 p-4 text-white text-center">
      <h1 className="text-2xl font-bold">Prompts</h1>
      <p className="text-gray-500">Manage your prompts here.</p>
      {prompts && prompts.prompts.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Available Prompts</h2>
          {/* List of available prompts */}
          <ul className="pl-5">
            {prompts.prompts.map((prompt) => (
              <li key={prompt.id} className="text-blue-500 cursor-pointer">
                <Link to={`/prompts/form/${prompt.id}`}>{prompt.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {prompts && prompts.prompts.length === 0 && (
        <p className="text-gray-500">No prompts available.</p>
      )}
      <div className="flex justify-center mt-4">
        <Link
          to="/prompts/form"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Create New Prompt
        </Link>
      </div>
    </div>
  );
};
