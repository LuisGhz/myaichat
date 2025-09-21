import { useEffect, useRef, useState } from "react";
import { NewConversation } from "../components/NewConversation";
import { InputSection } from "../components/InputSection/InputSection";
import { useChatParams } from "../hooks/useChatParams";
import { useChat } from "../hooks/useChat";
import { ChatMessages } from "../components/ChatMessages";

export const Chat = () => {
  const params = useChatParams();
  const { resetChatData, getChatMessages, loadPreviousMessages, messages } = useChat();
  const scrollContainerRef = useRef<HTMLElement>(null);
  const [isLoadingPreviousMessages, setIsLoadingPreviousMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [emptyPage, setEmptyPage] = useState(false);
  const previousMessageCountRef = useRef(0);
  const lastScrollHeightRef = useRef(0);
  const hasUserScrolledRef = useRef(false);
  const initialScrollPositionRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    if (!params.id) {
      resetChatData();
      return;
    }

    // Reset pagination state when chat changes
    setCurrentPage(0);
    setHasMoreMessages(true);
    setEmptyPage(false);
    hasUserScrolledRef.current = false; // Reset scroll tracking
    initialScrollPositionRef.current = null; // Reset initial position tracking
    isProgrammaticScrollRef.current = false; // Reset programmatic scroll tracking
    getChatMessages(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Auto-scroll when messages update (during streaming)
  useEffect(() => {
    if (scrollContainerRef.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const currentMessageCount = messages.length;
      const previousMessageCount = previousMessageCountRef.current;

      // Check if messages were added at the beginning (pagination)
      const messagesAddedAtTop = currentMessageCount > previousMessageCount && 
                                currentMessageCount - previousMessageCount > 1;

      // Only auto-scroll if:
      // 1. The last message is from assistant (streaming)
      // 2. Messages weren't loaded at the top (pagination)
      // 3. Not currently loading previous messages
      if (
        lastMessage.role === "Assistant" && 
        !messagesAddedAtTop && 
        !isLoadingPreviousMessages
      ) {
        isProgrammaticScrollRef.current = true;
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
        // Reset the flag after a short delay to allow the scroll to complete
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 500);
      } else if (messagesAddedAtTop && isLoadingPreviousMessages) {
        // Maintain scroll position when loading previous messages
        isProgrammaticScrollRef.current = true;
        const currentScrollHeight = scrollContainerRef.current.scrollHeight;
        const heightDifference = currentScrollHeight - lastScrollHeightRef.current;
        scrollContainerRef.current.scrollTop += heightDifference;
        setIsLoadingPreviousMessages(false);
        // Reset the flag after scroll position adjustment
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 100);
      }

      // Update refs
      previousMessageCountRef.current = currentMessageCount;
      lastScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoadingPreviousMessages]);

  // Handle scroll to detect when user reaches the top for pagination
  const handleScroll = async () => {
    if (!scrollContainerRef.current || !params.id) return;

    // Ignore scroll events during programmatic scrolling
    if (isProgrammaticScrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Capture the initial scroll position when content is first loaded
    if (initialScrollPositionRef.current === null && scrollHeight > clientHeight) {
      initialScrollPositionRef.current = scrollTop;
      return; // Exit early on first measurement
    }

    // Only mark as user scrolled if the scroll position has changed from initial position
    // and we have an initial position recorded
    if (
      initialScrollPositionRef.current !== null && 
      Math.abs(scrollTop - initialScrollPositionRef.current) > 10 && // 10px tolerance
      !hasUserScrolledRef.current
    ) {
      hasUserScrolledRef.current = true;
    }

    const threshold = 100; // pixels from top

    // Only trigger pagination if:
    // 1. User scrolled near the top
    // 2. Not already loading
    // 3. Has more messages to load
    // 4. Last page wasn't empty
    // 5. User has actually scrolled (not initial state)
    // 6. There are existing messages
    if (
      scrollTop < threshold && 
      !isLoadingPreviousMessages && 
      hasMoreMessages && 
      !emptyPage &&
      hasUserScrolledRef.current &&
      messages.length > 0
    ) {
      setIsLoadingPreviousMessages(true);
      
      try {
        const nextPage = currentPage + 1;
        const loadedMessagesCount = await loadPreviousMessages(params.id, nextPage);
        
        if (loadedMessagesCount > 0) {
          setCurrentPage(nextPage);
          setEmptyPage(false); // Reset emptyPage since we got content
        } else if (loadedMessagesCount === -1) {
          // Empty page returned - mark as empty and decrease the page counter
          setEmptyPage(true);
          setHasMoreMessages(false);
          setIsLoadingPreviousMessages(false);
        } else {
          // Error occurred or no response
          setHasMoreMessages(false);
          setIsLoadingPreviousMessages(false);
        }
      } catch (error) {
        console.error("Error loading previous messages:", error);
        setIsLoadingPreviousMessages(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <section 
        ref={scrollContainerRef}
        className="grow overflow-auto pb-10 scroll-hidden mx-auto w-full md:w-11/12 xl:10/12 max-w-4xl"
        role="main"
        aria-label="Chat conversation"
        onScroll={handleScroll}
      >
        {isLoadingPreviousMessages && (
          <div className="flex justify-center p-4" role="status" aria-live="polite">
            <span className="text-sm app-text">Loading previous messages...</span>
          </div>
        )}
        {messages.length === 0 && <NewConversation />}
        {messages.length > 0 && <ChatMessages messages={messages} />}
      </section>
      <InputSection />
    </div>
  );
};
