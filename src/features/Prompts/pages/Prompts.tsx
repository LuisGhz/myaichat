import { useNavigate } from "react-router";
import { Button } from "antd";

export const Prompts = () => {
  const navigate = useNavigate();
  return (
    <section className="flex justify-center items-center h-full flex-col gap-4">
      <h2 className="text-lg text-center app-text font-semibold">
        Create/Edit your custom prompts here!
      </h2>
      <section>
        <ul className="app-text">
          <li className="cursor-pointer w-48 py-1.5 hover:bg-gray-400 hover:text-shadow-gray-800 dark:hover:bg-gray-600 dark:hover:text-shadow-gray-200 transition-colors duration-200 rounded-xs px-0.5">
            Prompt 1
          </li>
          <li className="cursor-pointer w-48 py-1.5 hover:bg-gray-400 hover:text-shadow-gray-800 dark:hover:bg-gray-600 dark:hover:text-shadow-gray-200 transition-colors duration-200 rounded-xs px-0.5">
            Prompt 2
          </li>
          <li className="cursor-pointer w-48 py-1.5 hover:bg-gray-400 hover:text-shadow-gray-800 dark:hover:bg-gray-600 dark:hover:text-shadow-gray-200 transition-colors duration-200 rounded-xs px-0.5">
            Prompt 3
          </li>
          <li className="cursor-pointer w-48 py-1.5 hover:bg-gray-400 hover:text-shadow-gray-800 dark:hover:bg-gray-600 dark:hover:text-shadow-gray-200 transition-colors duration-200 rounded-xs px-0.5">
            Prompt 4
          </li>
        </ul>
      </section>
      <section>
        <Button
          type="primary"
          onClick={() => navigate("/prompts/form")}
          aria-label="Create New Prompt"
        >
          Create New Prompt
        </Button>
      </section>
    </section>
  );
};
