import { useEffect, useRef, useState } from "react";
import { Divider, Skeleton } from "antd";
import { ChatItem } from "./ChatItem";
import {
  ChatContextMenu,
  ContextMetadata,
} from "components/context-menu/ChatContextMenu";
import { useSideNav } from "core/hooks/useSideNav";
import { useAppStore } from "store/app/AppStore";
import { RenameChatModal } from "core/modals/RenameChatModal";

export const ChatsList = () => {
  const { getChatsSummary, chatsSummary } = useSideNav();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [contextMetadata, setContextMetadata] = useState<ContextMetadata>({
    x: 0,
    y: 0,
  });
  const [chatInContextMenu, setChatInContextMenu] =
    useState<ChatSummary | null>(null);
  const parentRef = useRef<HTMLLIElement | null>(null);
  const [groupedChats, setGroupedChats] =
    useState<Partial<Record<"fav" | "unfav", ChatSummary[]>>>();
  const { isGettingNewChat } = useAppStore();

  useEffect(() => {
    getChatsSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const res = Object.groupBy(chatsSummary, (chat) =>
      chat.fav ? "fav" : "unfav"
    );
    setGroupedChats(res);
  }, [chatsSummary]);

  const handleContextMenu = (chatId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const chat = chatsSummary.find((c) => c.id === chatId);
    setContextMetadata({ x: e.pageX, y: e.pageY });
    setChatInContextMenu(chat!);
    parentRef.current = e.currentTarget as HTMLLIElement;
    setIsContextMenuOpen(true);
  };

  const handleRename = (id: string) => {
    const chat = chatsSummary.find((c) => c.id === id);
    setChatInContextMenu(chat!);
    setIsRenameModalOpen(true);
  };

  return (
    <div className="grow">
      {groupedChats && (
        <ul>
          <>
            {groupedChats.fav && (
              <>
                {groupedChats.fav.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    onContextMenu={handleContextMenu}
                  />
                ))}
                {chatsSummary.length > 0 && (
                  <Divider className="my-2! dark:bg-gray-700" />
                )}
              </>
            )}
          </>
          <>
            {groupedChats.unfav &&
              groupedChats.unfav.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  onContextMenu={handleContextMenu}
                />
              ))}
          </>
          {isGettingNewChat && <Skeleton.Button className="!w-full" active />}
        </ul>
      )}
      <ChatContextMenu
        contextMetadata={contextMetadata}
        chat={chatInContextMenu}
        parentRef={parentRef}
        isContextMenuOpen={isContextMenuOpen}
        setIsContextMenuOpen={setIsContextMenuOpen}
        onRename={handleRename}
      />
      <RenameChatModal
        chatId={chatInContextMenu?.id}
        currentChatName={chatInContextMenu?.title}
        isOpen={isRenameModalOpen}
        setIsOpen={setIsRenameModalOpen}
      />
    </div>
  );
};
