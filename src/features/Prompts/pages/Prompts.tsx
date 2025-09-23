import { Link, useNavigate } from "react-router";
import { Button } from "antd";
import { usePrompts } from "../hooks/usePrompts";
import { useEffect } from "react";
import { TrashOutlineIcon } from "icons/TrashOutlineIcon";

export const Prompts = () => {
  const navigate = useNavigate();
  const { getAllPrompts, promptsSummary } = usePrompts();

  useEffect(() => {
    getAllPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex justify-center items-center h-full flex-col gap-4">
      <h2 className="text-lg text-center app-text font-semibold">
        Create/Edit your custom prompts here!
      </h2>
      <section>
        <ul className="app-text">
          {promptsSummary.map((prompt) => (
            <li
              key={prompt.id}
              className="cursor-pointer w-48 py-1.5 hover:bg-gray-400 hover:text-shadow-gray-800 dark:hover:bg-gray-600 dark:hover:text-shadow-gray-200 transition-colors duration-200 rounded-xs px-0.5 flex justify-between"
            >
              <Link className="!text-inherit" to={`/prompts/${prompt.id}`}>
                {prompt.name}
              </Link>
              <button
                className="hover:text-red-600 text-inherit transition-c-200 cursor-pointer text-lg"
                aria-label="Delete Prompt"
                title="Delete Prompt"
                type="button"
              >
                <TrashOutlineIcon />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Button
          type="primary"
          onClick={() => navigate("/prompts/form")}
          aria-label="Create New Prompt"
          role="link"
        >
          Create New Prompt
        </Button>
      </section>
    </section>
  );
};
