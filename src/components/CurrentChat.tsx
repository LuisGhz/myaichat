import { useChats } from "hooks/useChats";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Message } from "types/chat/Message.type";
import { MessagesList } from "./MessagesList";
import { InputSection } from "./InputSection";

export const CurrentChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const params = useParams();
  const { getChatMessages } = useChats();

  useEffect(() => {
    (async () => {
      if (params.id)
        setMessages(await getChatMessages(params.id))
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<>
    <div className="flex flex-col h-full max-w-9/12 mx-auto pt-2">
      {messages.length === 0 && <section className="grow">History</section>}
      {messages.length > 0 && <section className="grow"><MessagesList messages={messages} /></section>}
      <InputSection />
    </div>
  </>);
};