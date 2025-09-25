import { useEffect, useRef, useState } from "react";
import { NewConversation } from "../components/NewConversation";
import { InputSection } from "../components/InputSection/InputSection";
import { useChatParams } from "../hooks/useChatParams";
import { useChat } from "../hooks/useChat";
import { ChatMessages } from "../components/ChatMessages";
import { useLocation } from "react-router";

export const Chat = () => {
  const params = useChatParams();
  const location = useLocation();
  const fromStream = location.state?.fromStream;
  const { resetChatData, getChatMessages, messages } = useChat();

  useEffect(() => {
    if (!params.id) {
      resetChatData();
      return;
    }
    if (fromStream) return;
    getChatMessages(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div className="h-full flex flex-col">
      <section
        className="grow overflow-auto pb-10 scroll-hidden mx-auto w-full md:w-11/12 xl:10/12 max-w-4xl"
        role="main"
        aria-label="Chat conversation"
      >
        {messages.length === 0 && <NewConversation />}
        {messages.length > 0 && <ChatMessages messages={messages} />}
      </section>
      <InputSection />
    </div>
  );
};
