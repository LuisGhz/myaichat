import { Popover } from "antd";
import { useCurrentChatMetadata } from "features/Chat/hooks/useCurrentChatMetadata";
import { ExclamationCircleIcon } from "icons/ExclamationCircleIcon";
import { useChatStore } from "store/app/ChatStore";

export const CurrentChatMetadata = () => {
  const { currentChatMetadata } = useChatStore();
  const { formatCost, calculatePromptTokens, calculateCompletionTokens } =
    useCurrentChatMetadata(currentChatMetadata?.model || "");

  if (!currentChatMetadata) return null;

  const { totalPromptTokens, totalCompletionTokens, model } =
    currentChatMetadata;

  const content = (
    <ul className="flex flex-col gap-1">
      <li>
        <span className="font-semibold">Total Prompt Tokens</span>:{" "}
        {totalPromptTokens}
      </li>
      <li>
        <span className="font-semibold">Total Completion Tokens</span>:{" "}
        {totalCompletionTokens}
      </li>
      <li>
        <span className="font-semibold">Prompt cost (USD)</span>:{" "}
        {formatCost(calculatePromptTokens(totalPromptTokens))}
      </li>
      <li>
        <span className="font-semibold">Completion cost (USD)</span>:{" "}
        {formatCost(calculateCompletionTokens(totalCompletionTokens))}
      </li>
      <li>
        <span className="font-semibold">Model</span>: {model}
      </li>
    </ul>
  );

  return (
    <span>
      <Popover content={content}>
        <ExclamationCircleIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
      </Popover>
    </span>
  );
};
