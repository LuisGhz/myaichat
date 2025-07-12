import { useMarkDown } from "hooks/useMarkdown";
import { Message } from "types/chat/Message.type";
import { useState } from "react";
import { CheckIcon } from "assets/icons/CheckIcon";
import { DocumentDuplicateIcon } from "assets/icons/DocumentDuplicateIcon";

type Props = {
  message: Message;
  idx: number;
  messagesEndRef: React.RefObject<HTMLElement | null>;
  arr: Message[];
};

export const SingleMessage = ({ message, idx, messagesEndRef, arr }: Props) => {
  const formatToMarkDown = useMarkDown();
  const [isCopied, setIsCopied] = useState(false);

  const handleArticleRef = (el: HTMLDivElement | null) => {
    if (el && idx === arr.length - 1) messagesEndRef.current = el;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <article
      className={`markdown-content text-white mb-12 w-max max-w-[20rem] md:max-w-[27rem] lg:max-w-[40rem] xl:max-w-[44rem] break-words px-3 py-1 relative group ${
        message.role === "User" ? "user-message bg-cop-1 rounded-lg" : ""
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
      <button
        onClick={handleCopyToClipboard}
        className={`absolute -bottom-8 ${
          message.role === "User" ? "right-2" : "left-2"
        } bg-transparent hover:bg-cop-5 text-cop-7 border border-cop-5 transition-colors duration-200 text-xs px-2 py-1 rounded cursor-pointer`}
        aria-label="Copy message to clipboard"
        title="Copy message to clipboard"
      >
        {isCopied ? (
          <CheckIcon className="size-4" />
        ) : (
          <DocumentDuplicateIcon className="size-4" />
        )}
      </button>
    </article>
  );
};
