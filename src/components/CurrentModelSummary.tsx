import { Message } from "types/chat/Message.type";

type Props = {
  currentModel: string;
  messages: Message[];
};

export const CurrentModelSummary = ({ currentModel, messages }: Props) => {
  return (
    <>
      <div className="text-gray-700 text-xs text-end mb-1">
        {currentModel} - PromptTokens:
        {messages.length > 0 &&
          messages.reduce(
            (sum, message) => sum + (message.promptTokens ?? 0),
            0
          )}
        - ComplentionTokens:
        {messages.length > 0 &&
          messages.reduce(
            (sum, message) => sum + (message.completionTokens ?? 0),
            0
          )}
      </div>
    </>
  );
};
