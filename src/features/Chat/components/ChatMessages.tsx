import { MessageActionButtons } from "./MessageActionButtons";

type Props = {
  messages: ChatMessage[];
};

export const ChatMessages = ({ messages }: Props) => {
  return (
    <section className="flex flex-col gap-10 px-1 md:px-2">
      {messages.map((msg, idx) => (
        <div
          className={`${
            msg.role === "User" ? "self-end" : "self-start"
          } max-w-[70%] p-3 rounded-lg app-text bg-gray-300 dark:bg-gray-950 relative`}
          key={idx}
        >
          <p className="text-[1rem]">{msg.content}</p>
          {((msg.completionTokens || 0) > 0 || (msg.promptTokens || 0) > 0) && (
            <>
              <span className="text-xs block mt-1.5 app-text">
                Tokens:{" "}
                {msg.role === "User" ? msg.promptTokens : msg.completionTokens}
              </span>
              <MessageActionButtons role={msg.role} content={msg.content} />
            </>
          )}
        </div>
      ))}
    </section>
  );
};
