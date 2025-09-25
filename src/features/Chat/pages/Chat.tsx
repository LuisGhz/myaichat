import { useEffect, useRef } from "react";
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
  const { resetChatData, getChatMessages, messages, loadPreviousMessages } =
    useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstPageLoaded = useRef(false);
  const currentPage = useRef(0);
  const isEmptyPage = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current)
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 200);
    setTimeout(() => {
      isFirstPageLoaded.current = true;
    }, 1000);
  }, []);

  useEffect(() => {
    if (!params.id) {
      resetChatData();
      return;
    }
    if (fromStream) return;
    getChatMessages(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isFirstPageLoaded.current) return;
    const target = e.target as HTMLDivElement;
    const tolerance = 20;
    if (target.scrollTop < tolerance) {
      if (isEmptyPage.current) return;
      currentPage.current += 1;
      loadPreviousMessages(params.id!, currentPage.current).then(
        (newMessagesCount) => {
          console.log("New messages loaded:", newMessagesCount);
          if (newMessagesCount === -1) isEmptyPage.current = true;
        }
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <section
        className="grow overflow-auto pb-10 scroll-hidden mx-auto w-full md:w-11/12 xl:10/12 max-w-4xl scroll-smooth"
        role="main"
        aria-label="Chat conversation"
        ref={containerRef}
        onScroll={onScroll}
      >
        {messages.length === 0 && <NewConversation />}
        {messages.length > 0 && <ChatMessages messages={messages} />}
      </section>
      <InputSection />
    </div>
  );
};
