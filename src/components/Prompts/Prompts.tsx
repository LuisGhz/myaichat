import { TrashIcon } from "assets/icons/TrashIcon";
import { ContextMenu } from "components/ContextMenu";
import { useContextMenu } from "hooks/useContextMenu";
import { usePrompts } from "hooks/usePrompts";
import React, { useState, ReactNode, useRef, useEffect } from "react";
import { Link } from "react-router";

export const Prompts = () => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [elements, setElements] = useState<ReactNode[]>([]);
  const triggeredContextMenu = useRef<HTMLElement>(null);
  const { prompts, getPrompts } = usePrompts();
  const { onTouchStart, onTouchEnd } = useContextMenu();

  useEffect(() => {
    getPrompts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeletePrompt = (id: string) => () => {
    console.log("Delete prompt", id);
    setIsContextMenuOpen(false);
  };

  const updateElements = (id: string) => {
    setElements([
      <button
        className="cursor-pointer w-full text-red-700 flex gap-2"
        type="button"
        aria-label="Delete prompt"
        onClick={handleDeletePrompt(id)}
      >
        <TrashIcon className="w-5 min-w-5" />
        <span>Delete</span>
      </button>,
    ]);
  };

  const handleContextMenu =
    (id: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setIsContextMenuOpen(true);
      triggeredContextMenu.current = e.currentTarget;
      updateElements(id);
    };

  const handleTouchStart =
    (id: string) => (e: React.TouchEvent<HTMLElement>) => {
      onTouchStart(e, () => {
        e.preventDefault();
        setIsContextMenuOpen(true);
        triggeredContextMenu.current = e.currentTarget;
        updateElements(id);
      });
    };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 text-white text-center">
        <h1 className="text-2xl font-bold">Prompts</h1>
        <p className="text-gray-500">Manage your prompts here.</p>
        {prompts && prompts.prompts.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Available Prompts</h2>
            {/* List of available prompts */}
            <ul className="pl-5">
              {prompts.prompts.map((prompt) => (
                <li
                  className="text-blue-500 cursor-pointer"
                  key={prompt.id}
                  onContextMenu={handleContextMenu(prompt.id)}
                  onTouchStart={handleTouchStart(prompt.id)}
                  onTouchEnd={onTouchEnd}
                >
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
      <ContextMenu
        elements={elements}
        isOpen={isContextMenuOpen}
        setIsOpen={setIsContextMenuOpen}
        triggered={triggeredContextMenu.current!}
      />
    </>
  );
};
