import { ScreensWidth } from "consts/ScreensWidth";
import { AppContext } from "context/AppContext";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ContextMenu } from "./ContextMenu";
import { useChatsNavContextMenu } from "hooks/Components/SideNav/useChatsNavContextMenu";

export const ChatsNav = () => {
  const { chats, deleteChatById, setIsMenuOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();
  const {
    contextMenuLeft,
    contextMenuTop,
    currentContextMenu,
    setContextMenuLeft,
    setContextMenuTop,
    setCurrentContextMenu,
  } = useChatsNavContextMenu();

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
              title={chat.title}
            >
              <Link
                to={`/chat/${chat.id}`}
                className={`block whitespace-nowrap overflow-hidden text-ellipsis h-11 px-2 py-2 ${
                  chat.id === params.id ? "font-bold" : ""
                }`}
                aria-label={`Open chat: ${chat.title}`}
                onClick={handleRedirectToChatOnMobile}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenuTop(e.pageY);
                  setContextMenuLeft(e.pageX);
                  setCurrentContextMenu(() => chat.id);
                }}
              >
                {chat.title}
              </Link>
              <ContextMenu
                chat={chat}
                handleDeleteChat={handleDeleteChat}
                currentContextMenu={currentContextMenu}
                top={contextMenuTop}
                left={contextMenuLeft}
              />
            </li>
          ))}
      </ul>
    </>
  );
};
