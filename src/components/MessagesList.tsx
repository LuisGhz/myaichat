import { useEffect, useRef } from "react";
import { useMarkDown } from "hooks/useMarkdown";
import { Message } from "types/chat/Message.type";
import "./MessagesList.css";
import { ImageViewer } from "./ImageViewer";

type MessagesListProps = {
  messages: Message[];
};

export const MessagesList = ({ messages }: MessagesListProps) => {
  const formatToMarkDown = useMarkDown();
  const messagesEndRef = useRef<HTMLElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <ul className="w-full max-w-full">
        {messages.map((message, idx, arr) => (
          <li
            className={`flex flex-col w-full  ${
              message.role === "User" ? "items-end" : ""
            }`}
            key={idx}
          >
            {message.image && message.role === "User" && (
              <ImageViewer image={message.image} />
            )}
            <article
              className={`markdown-content text-white mb-2 w-max max-w-[20rem] md:max-w-[35rem] lg:max-w-[60rem] break-words px-3 py-1 relative ${
                message.role === "User"
                  ? "user-message bg-cop-10 rounded-lg"
                  : ""
              }`}
              ref={(el) => {
                if (el && idx === arr.length - 1) messagesEndRef.current = el;
              }}
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
            {message.image && message.role === "Assistant" && (
              <ImageViewer image={message.image} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
