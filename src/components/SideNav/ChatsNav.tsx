import { ScreensWidth } from "consts/ScreensWidth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
import { ChatItem } from "./ChatItem";

export const ChatsNav = () => {
  const chats = useAppChatsStore();
  const [groupedChats, setGroupedChats] = useState<
    Partial<Record<"favourites" | "others", ChatSummary[]>>
  >({});
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

  useEffect(() => {
    const res = Object.groupBy(chats, (chat) =>
      chat.fav ? "favourites" : "others"
    );
    setGroupedChats(res);
  }, [chats]);

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
        {chats.length > 0 && (
          <>
            {groupedChats.favourites?.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                handleRedirectToChatOnMobile={handleRedirectToChatOnMobile}
                handleContextMenu={handleContextMenu}
                handleContextMenuOnTouch={handleContextMenuOnTouch}
                onTouchEnd={onTouchEnd}
              />
            ))}
            {groupedChats.others?.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                handleRedirectToChatOnMobile={handleRedirectToChatOnMobile}
                handleContextMenu={handleContextMenu}
                handleContextMenuOnTouch={handleContextMenuOnTouch}
                onTouchEnd={onTouchEnd}
              />
            ))}
          </>
        )}
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
