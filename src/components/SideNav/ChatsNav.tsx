import { ScreensWidth } from "consts/ScreensWidth";
import { AppContext } from "context/AppContext";
import { ReactNode, useContext, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useContextMenu } from "hooks/useContextMenu";
import { ContextMenu } from "components/ContextMenu";
import { TrashIcon } from "assets/icons/TrashIcon";
import { PencilIcon } from "assets/icons/PencilIcon";
import { ChatSummary } from "types/chat/ChatSummary.type";

export const ChatsNav = () => {
  const { chats, deleteChatById, setIsMenuOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();
  const { onTouchStart, onTouchEnd } = useContextMenu();
  const [elements, setElements] = useState<ReactNode[]>([]);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const triggeredContextMenu = useRef<HTMLElement>(null);

  const handleDeleteChat = (id: string) => {
    deleteChatById(id);
    if (params.id === id) navigate("/chat");
  };

  const handleRenameChat = (id: string) => {
    console.log("Rename chat", id);
    alert("Not available yet.");
    setIsContextMenuOpen(false);
  };

  const handleRedirectToChatOnMobile = () => {
    if (window.innerWidth < ScreensWidth.tablet) setIsMenuOpen((prev) => !prev);
  };

  const updateElements = (chat: ChatSummary) => {
    setElements([
      <button
        className="cursor-pointer w-full text-red-700 flex gap-2"
        type="button"
        aria-label={`Delete chat: ${chat.title}`}
        onClick={() => {
          handleDeleteChat(chat.id);
          setIsContextMenuOpen(false);
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <TrashIcon className="w-5 min-w-5" />
        <span>Delete</span>
      </button>,
      <button
        className="cursor-pointer w-full text-white flex gap-2"
        type="button"
        aria-label="Rename chat"
        onClick={() => handleRenameChat(chat.id)}
      >
        <PencilIcon className="w-5 min-w-5" />
        <span>Rename</span>
      </button>,
    ]);
  };

  const handleContextMenu =
    (chat: ChatSummary) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      triggeredContextMenu.current = e.currentTarget;
      updateElements(chat);
      setIsContextMenuOpen(true);
    };

  const handleContextMenuOnTouch =
    (chat: ChatSummary) => (e: React.TouchEvent<HTMLElement>) => {
      onTouchStart(e, () => {
        e.preventDefault();
        triggeredContextMenu.current = e.currentTarget;
        updateElements(chat);
        setIsContextMenuOpen(true);
      });
    };

  const closeContextMenuOnAnyScroll = () => {
    const handleScroll = () => {
      setIsContextMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  };

  // Call the function to attach the scroll listener
  closeContextMenuOnAnyScroll();

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
                className={`block whitespace-nowrap overflow-hidden text-ellipsis w-full h-11 px-2 py-2 ${
                  chat.id === params.id ? "font-bold" : ""
                }`}
                aria-label={`Open chat: ${chat.title}`}
                onClick={handleRedirectToChatOnMobile}
                onContextMenu={handleContextMenu(chat)}
                onTouchStart={handleContextMenuOnTouch(chat)}
                onTouchEnd={onTouchEnd}
              >
                {chat.title}
              </Link>
            </li>
          ))}
      </ul>
      <ContextMenu
        isOpen={isContextMenuOpen}
        setIsOpen={setIsContextMenuOpen}
        elements={elements}
        triggered={triggeredContextMenu.current!}
        customClass="sidenav-context-menu"
      />
    </>
  );
};
