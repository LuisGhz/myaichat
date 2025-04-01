import { Message } from "types/chat/Message.type";
import "./MessagesList.css";
import { useMarkDown } from "hooks/useMarkdown";
import { useEffect, useRef } from "react";

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
            className={`flex w-full  ${
              message.role === "User" ? "justify-end" : ""
            }`}
            key={idx}
          >
            <article
              className={`text-white mb-2 w-full max-w-[15rem] md:max-w-[35rem] break-words ${
                message.role === "User" ? "user-message" : ""
              }`}
              ref={(el) => {
                if (el && idx === arr.length - 1) messagesEndRef.current = el;
              }}
            >
              {formatToMarkDown(message.content)}
            </article>
          </li>
        ))}
      </ul>
    </>
  );
};
