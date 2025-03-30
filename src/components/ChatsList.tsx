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
      <div className="absolute top-0 left-0 z-50 flex text-white gap-x-2">
        <Link to={"/"}>MyAIChat</Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <ArrowRightCircleIcon className="size-4" />
        </button>
        <Link className="flex justify-center" to={"/chat"}>
          <PencilSquareIcon className="size-4 text-white me-2 mt-1" />
        </Link>
      </div>
      <div
        className={`${
          isMenuOpen ? "w-64" : "w-0"
        } transition-width duration-500 md:relative bg-cop-4 `}
      >
        <ul
          className={`bg-cop-4 text-white h-full px-3 overflow-y-auto overflow-x-hidden hide-scrollbar fixed md:relative top-0 left-0 z-50 transition-all duration-500 w-64 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-lg md:shadow-none`}
        >
          <li className="flex justify-between items-center px-2 py-1">
            <Link to={"/"}>MyAIChat</Link>
            <ArrowLeftCircleIcon
              className="size-4 cursor-pointer text-white hover:text-gray-300 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            />
          </li>
          <li className="bg-cop-1 hover:bg-cop-2 cursor-pointer text-white px-2 py-1 text-center w-10/12 mx-auto rounded-sm transition-colors duration-300 my-3">
            <Link className="flex justify-center" to={"/chat"}>
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
                >
                  {chat.title}
                </Link>
                <TrashIcon
                  className="w-4 min-w-4 text-white cursor-pointer hover:text-gray-600 transition-colors duration-300"
                  onClick={() => deleteChatById(chat.id)}
                />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
