import { useChats } from "hooks/useChats";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Message } from "types/chat/Message.type";
import { MessagesList } from "./MessagesList";

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
    {messages.length === 0 && <section>History</section>}
    {messages.length > 0 && <MessagesList messages={messages} />}
    <section><input type="text" /></section>
  </>);
};