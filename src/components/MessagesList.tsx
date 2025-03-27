import { Message } from "types/chat/Message.type";

type MessagesListProps = {
  messages: Message[];
};

export const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <>
      <ul>
        {messages.map((message) => (
          <li>{message.content}</li>
        ))}
      </ul>
    </>
  );
};
