import { useEffect, useState } from "react";
import { Divider } from "antd";
import { ChatItem } from "./ChatItem";

export type Chat = {
  id: string;
  title: string;
  isFav: boolean;
};

export const ChatsList = () => {
  const [chats] = useState<Chat[]>([
    { id: "1", title: "Chat 1", isFav: false },
    { id: "2", title: "Chat 2", isFav: true },
    { id: "3", title: "Chat 3", isFav: false },
    { id: "4", title: "Chat 4", isFav: true },
    { id: "5", title: "Chat 5", isFav: false },
    { id: "6", title: "Chat 6", isFav: true },
    { id: "7", title: "Chat 7", isFav: false },
    { id: "8", title: "Chat 8", isFav: true },
    { id: "9", title: "Chat 9", isFav: false },
    { id: "10", title: "Chat 10", isFav: true },
  ]);
  const [groupedChats, setGroupedChats] =
    useState<Partial<Record<"fav" | "unfav", Chat[]>>>();

  useEffect(() => {
    const res = Object.groupBy(chats, (chat) => (chat.isFav ? "fav" : "unfav"));
    setGroupedChats(res);
  }, [chats]);

  return (
    <div className="mt-3">
      {groupedChats && (
        <ul>
          <>
            {groupedChats.fav && (
              <>
                {groupedChats.fav.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
                <Divider />
              </>
            )}
          </>
          <>
            {groupedChats.unfav &&
              groupedChats.unfav.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
          </>
        </ul>
      )}
    </div>
  );
};
