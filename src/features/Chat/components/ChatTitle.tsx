import { useParams } from "react-router";
import { useAppChatsStore } from "store/useAppStore";

export const ChatTitle = () => {
  const params = useParams<{ id: string }>();
  const chats = useAppChatsStore();
  const chat = chats.find((chat) => chat.id === params.id);

  if (!chat) return null;

  return (
    <section className="flex justify-end sm:justify-center pt-1.5 pb-2 md:pb-3.5">
      <h3 className="text-white pe-1 text-lg font-bold max-w-8/12 sm:max-w-max truncate">
        {chat?.title}
      </h3>
    </section>
  );
};
