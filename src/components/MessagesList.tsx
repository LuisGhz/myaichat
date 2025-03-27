import { Message } from "types/chat/Message.type";
import "./MessagesList.css";

type MessagesListProps = {
  messages: Message[];
};

export const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <>
      <ul className="w-full">
        {messages.map((message) => (
          <li className={`flex w-full ${message.role === 'User' ? 'justify-end' : ''}`}>
            <div className={`w-max max-w-[35rem] text-white mb-2 ${message.role === 'User' ? 'user-message' : ''}`}>
              {message.content}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
