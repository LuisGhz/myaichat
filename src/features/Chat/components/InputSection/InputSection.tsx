import { useEffect, useState } from "react";
import { Input } from "antd";
import { SendAltFilledIcon } from "icons/SendAltFilledIcon";
import { InputActionButtons } from "./InputActionButtons";
import { useChatParams } from "features/Chat/hooks/useChatParams";

const { TextArea } = Input;

export const InputSection = () => {
  const [newMessage, setNewMessage] = useState("");
  const params = useChatParams();

  useEffect(() => {
    setNewMessage("");
  }, [params.id]);

  return (
    <section className="w-full md:w-11/12 xl:10/12 mx-auto border-[1px] border-b-0 border-gray-300 rounded-t-lg p-2 pb-4">
      <section className="flex gap-2 items-end mb-2 px-1">
        <TextArea
          className="!bg-transparent !border-0 !resize-none focus:!border-0 focus:!ring-0 scroll-hidden !text-gray-700 dark:!text-gray-200"
          placeholder="Type a message..."
          autoSize={{ minRows: 2, maxRows: 20 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="button">
          <SendAltFilledIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
        </button>
      </section>
      <InputActionButtons />
    </section>
  );
};
