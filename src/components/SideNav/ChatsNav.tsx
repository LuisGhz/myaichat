import { ScreensWidth } from "consts/ScreensWidth";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useContextMenu } from "hooks/useContextMenu";
import { ContextMenu } from "components/ContextMenu";
import { ChatSummary } from "types/chat/ChatSummary.type";
import { useChats } from "hooks/useChats";
import {
  useAppChatsStore,
  useAppIsMenuOpenStore,
  useAppSetIsMenuOpenStore,
  useAppUpdateChatTitleStore,
} from "store/useAppStore";
import { useChatsNavContextMenu } from "hooks/components/useChatsNavContextMenu";
import { RenameChatModal } from "components/modals/RenameChatModal";

export const ChatsNav = () => {
  const chats = useAppChatsStore();
  const isMenuOpen = useAppIsMenuOpenStore();
  const setIsMenuOpen = useAppSetIsMenuOpenStore();
  const updateChatTitle = useAppUpdateChatTitleStore();
  const { getAllChats } = useChats();
  const { onTouchStart, onTouchEnd } = useContextMenu();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const { deleteChat: deleteChatById, renameChatTitle } = useChats();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const triggeredContextMenu = useRef<HTMLElement>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<ChatSummary | null>(null);
  const { elements, updateElements } = useChatsNavContextMenu({
    setIsContextMenuOpen,
  });

  useEffect(() => {
    getAllChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirectToChatOnMobile = () => {
    if (window.innerWidth < ScreensWidth.tablet) setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteChat = (id: string) => {
    deleteChatById(id);
    if (params.id === id) navigate("/chat");
  };

  const handleRenameModal = (id: string) => {
    setIsRenameModalOpen(true);
    const chat = chats.find((chat) => chat.id === id);
    if (chat) setChatToRename(chat);
    setIsContextMenuOpen(false);
  };

  const onRenameCancel = () => {
    setIsRenameModalOpen(false);
    setChatToRename(null);
  };

  const onRenameOk = async (id: string, newTitle: string) => {
    await renameChatTitle(id, newTitle);
    setIsRenameModalOpen(false);
    updateChatTitle(id, newTitle);
    setChatToRename(null);
  };

  const handleContextMenu =
    (chat: ChatSummary) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      triggeredContextMenu.current = e.currentTarget;
      updateElements({
        chat,
        handleDeleteChat,
        handleRenameModal,
      });
      setIsContextMenuOpen(true);
    };

  const handleContextMenuOnTouch =
    (chat: ChatSummary) => (e: React.TouchEvent<HTMLElement>) => {
      onTouchStart(e, () => {
        e.preventDefault();
        triggeredContextMenu.current = e.currentTarget;
        updateElements({ chat, handleDeleteChat, handleRenameModal });
        setIsContextMenuOpen(true);
      });
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
      {isRenameModalOpen && chatToRename && (
        <RenameChatModal
          chat={chatToRename}
          onOk={onRenameOk}
          onCancel={onRenameCancel}
        />
      )}
    </>
  );
};
