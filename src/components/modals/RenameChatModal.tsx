import { Input, Modal } from "antd";
import { useState } from "react";
import { ChatSummary } from "types/chat/ChatSummary.type";

type Props = {
  chat: ChatSummary;
  onOk: (id: string, newTitle: string) => void;
  onCancel: () => void;
};

export const RenameChatModal = ({ chat, onOk, onCancel }: Props) => {
  const [newTitle, setNewTitle] = useState(chat.title);

  return (
    <Modal
      open
      title="Rename Chat"
      onCancel={onCancel}
      onOk={() => onOk(chat.id, newTitle)}
      centered
      width={320}
      className="rename-chat-modal"
    >
      <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
    </Modal>
  );
};
