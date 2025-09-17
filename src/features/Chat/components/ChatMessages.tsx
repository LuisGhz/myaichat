type Props = {
  messages: ChatMessage[];
};

export const ChatMessages = ({ messages }: Props) => {
  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>{msg.content}</div>
      ))}
    </div>
  );
};
