import { useMarkDown } from "hooks/useMarkdown";
import { Message } from "types/chat/Message.type";

type Props = {
  message: Message;
  idx: number;
  messagesEndRef: React.RefObject<HTMLElement | null>;
  arr: Message[];
}

export const SingleMessage = ({ message, idx, messagesEndRef, arr }: Props) => {
  const formatToMarkDown = useMarkDown();

  const handleArticleRef = (el: HTMLDivElement | null) => {
    if (el && idx === arr.length - 1) messagesEndRef.current = el;
  }

  return (
    <article
      className={`markdown-content text-white mb-2 w-max max-w-[20rem] md:max-w-[30rem] lg:max-w-[40rem] xl:max-w-[50rem] break-words px-3 py-1 relative ${
        message.role === "User" ? "user-message bg-cop-10 rounded-lg" : ""
      }`}
      ref={handleArticleRef}
    >
      {formatToMarkDown(message.content)}
      {message.promptTokens && (
        <span className="text-xs text-gray-600">
          Tokens: {message.promptTokens}
        </span>
      )}
      {message.completionTokens && (
        <span className="text-xs text-gray-600">
          Tokens: {message.completionTokens}
        </span>
      )}
    </article>
  );
};
