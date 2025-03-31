import { Message } from "types/chat/Message.type";
import "./MessagesList.css";
import { useMarkDown } from "hooks/useMarkdown";
import { useEffect, useRef } from "react";

type MessagesListProps = {
  messages: Message[];
};

export const MessagesList = ({ messages }: MessagesListProps) => {
  const formatToMarkDown = useMarkDown();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <ul className="w-full">
        {messages.map((message, idx, arr) => (
          <li
            className={`flex w-full ${
              message.role === "User" ? "justify-end" : ""
            }`}
            key={idx}
          >
            <div
              className={`w-max max-w-[15rem] md:max-w-[35rem] text-white mb-2 ${
                message.role === "User" ? "user-message" : ""
              }`}
              ref={(el) => {
                if (el && idx === arr.length - 1) messagesEndRef.current = el;
              }}
            >
              {formatToMarkDown(message.content)}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
