import { PencilSquareIcon } from "assets/icons/PencilSquareIcon";
import { TrashIcon } from "assets/icons/TrashIcon";
import { AppContext } from "context/AppContext";
import { useContext } from "react";
import { Link } from "react-router";

export const ChatsList = () => {
  const { chats, deleteChatById } = useContext(AppContext);

  return (
    <>
      <ul className="bg-cop-4 text-white h-full px-3 overflow-y-auto hide-scrollbar">
        <li>
          <Link to={"/"}>Bienvenido</Link>
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
    </>
  );
};
