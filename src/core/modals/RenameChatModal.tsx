import { Input, Modal, Button } from "antd";
import { useChatContext } from "core/hooks/useChatContext";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

type Props = {
  chatId?: string;
  currentChatName?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const RenameChatModal = ({
  chatId,
  currentChatName,
  isOpen,
  setIsOpen,
}: Props) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const { renameChat } = useChatContext();

  useEffect(() => {
    if (currentChatName && isOpen) {
      setName(currentChatName);
      setNameError(null);
    }
  }, [currentChatName, isOpen]);

  const nameSchema = useMemo(
    () => z.string().min(2).max(50).trim().nonempty("Chat name is required"),
    []
  );

  const validateName = (cName?: string) => {
    const result = nameSchema.safeParse(cName || name);
    if (!result.success) {
      setNameError(result.error.issues[0].message);
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleRename = async () => {
    const isValid = validateName();
    if (!chatId) return;
    if (!isValid) return;
    setNameError(null);
    await renameChat(chatId, name);
    setIsOpen(false);
  };

  return (
    <Modal
      className="rename-chat-modal"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <h1>Rename Chat</h1>
      <Input
        className="!mt-4"
        placeholder="Enter new chat name"
        onPressEnter={handleRename}
        value={name}
        onChange={(e) => {
          validateName(e.target.value);
          setName(e.target.value);
        }}
      />
      {nameError && <p className="text-red-500">{nameError}</p>}
      <section className="mt-4 flex justify-end gap-2">
        <Button onClick={handleRename}>Rename</Button>
      </section>
    </Modal>
  );
};
