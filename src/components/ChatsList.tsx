import { ArrowLeftCircleIcon } from "assets/icons/ArrowLeftCircleIcon";
import { ArrowRightCircleIcon } from "assets/icons/ArrowRightCircleIcon";
import { PencilSquareIcon } from "assets/icons/PencilSquareIcon";
import { TrashIcon } from "assets/icons/TrashIcon";
import { AppContext } from "context/AppContext";
import { useContext, useState } from "react";
import { Link } from "react-router";

export const ChatsList = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { chats, deleteChatById } = useContext(AppContext);

  return (
    <>
      <section className="absolute top-0 left-0 z-50 flex text-white gap-x-2">
        <Link aria-label="Go to home page" to={"/"}>
          MyAIChat
        </Link>
        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="sidebar-menu"
          aria-label={isMenuOpen ? "Close sidebar menu" : "Open sidebar menu"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <ArrowRightCircleIcon className="size-4" />
        </button>
        <Link
          className="flex justify-center"
          to={"/chat"}
          aria-label="New conversation"
        >
          <PencilSquareIcon className="size-4 text-white me-2 mt-1" />
        </Link>
      </section>
      <nav
        className={`${
          isMenuOpen ? "w-0 md:w-64" : "w-0"
        } transition-width duration-500 relative bg-cop-4 `}
        role="navigation"
        aria-label="Chat navigation"
      >
        <ul
          className={`bg-cop-4 text-white h-full px-3 overflow-y-auto overflow-x-hidden hide-scrollbar fixed md:relative top-0 left-0 z-50 transition-all duration-500 w-64 ${
            isMenuOpen
              ? "-translate-x-full md:translate-x-0"
              : "translate-x-0 md:-translate-x-full"
          } shadow-lg md:shadow-none`}
        >
          <li className="flex justify-between items-center px-2 py-1">
            <Link to={"/"} aria-label="Go to homepage">
              MyAIChat
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Close sidebar menu"
            >
              <ArrowLeftCircleIcon className="size-4 cursor-pointer text-white hover:text-gray-300 transition-colors duration-300" />
            </button>
          </li>
          <li className="bg-cop-1 hover:bg-cop-2 cursor-pointer text-white px-2 py-1 text-center w-10/12 mx-auto rounded-sm transition-colors duration-300 my-3">
            <Link
              className="flex justify-center"
              to={"/chat"}
              aria-label="New conversation"
            >
              <PencilSquareIcon className="size-4 text-white me-2 mt-1" />
              <span>New conversation</span>
            </Link>
          </li>
          {chats.length > 0 &&
            chats.map((chat) => (
              <li
                className="my-3 hover:bg-cop-6 transition-colors duration-300 rounded-lg flex justify-between"
                key={chat.id}
              >
                <Link
                  to={`/chat/${chat.id}`}
                  className="block whitespace-nowrap overflow-hidden text-ellipsis h-11 px-2 py-2"
                  aria-label={`Open chat: ${chat.title}`}
                >
                  {chat.title}
                </Link>
                <button
                  type="button"
                  onClick={() => deleteChatById(chat.id)}
                  aria-label={`Delete chat: ${chat.title}`}
                >
                  <TrashIcon className="w-4 min-w-4 text-white cursor-pointer hover:text-gray-600 transition-colors duration-300" />
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
};
