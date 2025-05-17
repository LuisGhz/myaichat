import { useEffect, useRef } from "react";
import { Message } from "types/chat/Message.type";
import "./Messages.css";
import { ImageViewer } from "../ImageViewer";
import { SingleMessage } from "./SingleMessage";
import { AssistantTyping } from "./AssistantTyping";

type MessagesListProps = {
  messages: Message[];
  isUpdatingMessagesFromScroll: boolean;
  isSending: boolean;
};

export const Messages = ({
  messages,
  isUpdatingMessagesFromScroll,
  isSending,
}: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isUpdatingMessagesFromScroll) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <SingleMessage
              arr={arr}
              idx={idx}
              message={message}
              messagesEndRef={messagesEndRef}
            />
            {message.image && message.role === "Assistant" && (
              <ImageViewer image={message.image} />
            )}
          </li>
        ))}
        {isSending && (
          <li className="flex flex-col w-full">
            <AssistantTyping />
          </li>
        )}
      </ul>
    </>
  );
};
