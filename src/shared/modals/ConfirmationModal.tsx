import { Modal } from "antd";
import { useEffect, useState } from "react";

type Props = {
  message: string[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmationModal = ({
  message,
  isOpen,
  onClose,
  onConfirm,
}: Props) => {
  const [currentMessage, setCurrentMessage] = useState<string[]>(message);

  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  return (
    <Modal
      className="generic-modal"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onClose}
    >
      <h2 className="font-semibold mb-3 text-lg">Confirm action.</h2>
      <div>
        {currentMessage.map((msg, index) => (
          <p key={index} className="app-text">
            {msg}
          </p>
        ))}
      </div>
    </Modal>
  );
};
