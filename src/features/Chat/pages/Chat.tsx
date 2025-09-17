import { useEffect } from "react";
import { NewConversation } from "../components/NewConversation";
import { InputSection } from "../components/InputSection/InputSection";
import { useChatParams } from "../hooks/useChatParams";
import { useChat } from "../hooks/useChat";
import { ChatMessages } from "../components/ChatMessages";

export const Chat = () => {
  const params = useChatParams();
  const { resetChatData, getChatMessages, messages } = useChat();

  useEffect(() => {
    if (!params.id) {
      resetChatData();
      return;
    }

    getChatMessages(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div className="h-full flex flex-col">
      <section className="grow overflow-auto pb-10 scroll-hidden">
        {messages.length === 0 && <NewConversation />}
        {messages.length > 0 && <ChatMessages messages={messages} />}
      </section>
      <InputSection />
    </div>
  );
};
