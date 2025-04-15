import { TrashIcon } from "assets/icons/TrashIcon";
import { ScreensWidth } from "consts/ScreensWidth";
import { AppContext } from "context/AppContext";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";

export const ChatsNav = () => {
  const { chats, deleteChatById, setIsMenuOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();

  const handleDeleteChat = (id: string) => {
    deleteChatById(id);
    if (params.id === id) navigate("/chat");
  };

  const handleRedirectToChatOnMobile = () => {
    if (window.innerWidth < ScreensWidth.tablet) setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <ul className={`px-2`}>
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
                onClick={handleRedirectToChatOnMobile}
              >
                {chat.title}
              </Link>
              <button
                type="button"
                onClick={() => handleDeleteChat(chat.id)}
                aria-label={`Delete chat: ${chat.title}`}
              >
                <TrashIcon className="w-5 min-w-5 text-white cursor-pointer hover:text-gray-600 transition-colors duration-300" />
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};
