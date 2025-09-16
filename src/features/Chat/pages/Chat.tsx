import { useState } from "react";
import { useParams } from "react-router";
import { NewConversation } from "../components/NewConversation";
import { InputSection } from "../components/InputSection/InputSection";

export const Chat = () => {
  const params = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <div className="h-full flex flex-col">
      <section className="grow">
        {messages.length === 0 && <NewConversation />}
      </section>
      <InputSection />
    </div>
  );
};
