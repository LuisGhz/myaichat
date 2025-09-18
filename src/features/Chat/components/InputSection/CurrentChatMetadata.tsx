import { Popover } from "antd";
import { ExclamationCircleIcon } from "icons/ExclamationCircleIcon";
import { useChatStore } from "store/app/ChatStore";

export const CurrentChatMetadata = () => {
  const { currentChatMetadata } = useChatStore();

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
