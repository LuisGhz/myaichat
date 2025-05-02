import { ScreensWidth } from "consts/ScreensWidth";
import { AppContext } from "context/AppContext";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ChatsContextMenu } from "./ChatsContextMenu";
import { useChatsNavContextMenu } from "hooks/Components/SideNav/useChatsNavContextMenu";

export const ChatsNav = () => {
  const { chats, deleteChatById, setIsMenuOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();
  const {
    contextMenuLeft,
    contextMenuTop,
    currentContextMenu,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    closeContextMenu,
  } = useChatsNavContextMenu();

  const handleDeleteChat = (id: string) => {
    deleteChatById(id);
    if (params.id === id) navigate("/chat");
  };

  const handleRenameChat = (id: string) => {
    console.log("Rename chat", id);
    alert("Not available yet.");
    closeContextMenu();
  }

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
              title={chat.title}
            >
              <Link
                to={`/chat/${chat.id}`}
                className={`block whitespace-nowrap overflow-hidden text-ellipsis h-11 px-2 py-2 ${
                  chat.id === params.id ? "font-bold" : ""
                }`}
                aria-label={`Open chat: ${chat.title}`}
                onClick={handleRedirectToChatOnMobile}
                onTouchStart={(e) => onTouchStart(e, chat.id)}
                onTouchEnd={(e) => onTouchEnd(e)}
                onContextMenu={(e) => onContextMenu(e, chat.id)}
              >
                {chat.title}
              </Link>
              <ChatsContextMenu
                chat={chat}
                currentContextMenu={currentContextMenu}
                top={contextMenuTop}
                left={contextMenuLeft}
                handleDeleteChat={handleDeleteChat}
                handleRenameChat={handleRenameChat}
              />
            </li>
          ))}
      </ul>
    </>
  );
};
