type Props = {
  messages: ChatMessage[];
};

export const ChatMessages = ({ messages }: Props) => {
  return (
    <section className="flex flex-col gap-4 px-1 md:px-2">
      {messages.map((msg, idx) => (
        <div
          className={`${
            msg.role === "User" ? "self-end" : "self-start"
          } max-w-[70%] p-3 rounded-lg app-text bg-gray-300 dark:bg-gray-950`}
          key={idx}
        >
          {msg.content}
        </div>
      ))}
    </section>
  );
};
