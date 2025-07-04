import { Modal, Input, Tooltip } from "antd";
import { InformationIcon } from "assets/icons/InformationIcon";
import { useFormat } from "hooks/useFormat";
import { useEffect, useState } from "react";
import { FeatureCheckbox } from "./components/FeatureCheckbox";
import {
  useCurrentChatStoreGetIsWebSearchMode,
  useCurrentChatStoreSetIsWebSearchMode,
} from "store/features/chat/useCurrentChatStore";

type Props = {
  isOpen: boolean;
  maxOutputTokens: number;
  onCancel: (newMaxOutputTokens: number) => void;
};

export const ChatConfigModal = ({
  isOpen,
  maxOutputTokens,
  onCancel,
}: Props) => {
  const [maxTokens, setMaxTokens] = useState<number>(maxOutputTokens);
  const [isThinkingMode, setisThinkingMode] = useState<boolean>(false);
  const { fNumber } = useFormat();
  const isWebSearchMode = useCurrentChatStoreGetIsWebSearchMode();
  const setIsWebSearchMode = useCurrentChatStoreSetIsWebSearchMode();
  const modalWidth = 360;
  const minTokens = 1000;
  const maxTokensLimit = 8000;

  useEffect(() => {
    setMaxTokens(maxOutputTokens);
  }, [maxOutputTokens]);

  useEffect(() => {
    if (isThinkingMode) {
      alert("No available yet.");
      setisThinkingMode(false);
    }
  }, [isThinkingMode]);

  return (
    <Modal
      className="chat-configuration-modal"
      open={isOpen}
      title="Chat Configuration"
      footer={null}
      width={modalWidth}
      centered
      onCancel={() => onCancel(maxTokens)}
    >
      <div className="p-4">
        <div>
          <label className="flex gap-1" htmlFor="max-tokens">
            Max Output Tokens
            <Tooltip
              title={`The maximum number of tokens the model can generate in a single response. min: ${fNumber(
                minTokens
              )}, max: ${fNumber(maxTokensLimit)}`}
              placement="top"
            >
              <InformationIcon
                className="size-4"
                aria-label="Information about max output tokens"
                role="img"
              />
            </Tooltip>
          </label>
          <Input
            id="max-tokens"
            placeholder="Type max tokens"
            type="number"
            min={minTokens}
            max={maxTokensLimit}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            aria-describedby="max-tokens-help"
          />
          <div id="max-tokens-help" className="sr-only">
            The maximum number of tokens the model can generate in a single
            response. Minimum {fNumber(minTokens)}, maximum{" "}
            {fNumber(maxTokensLimit)}.
          </div>
        </div>
        <FeatureCheckbox
          isActive={isThinkingMode}
          onToggle={setisThinkingMode}
          id="thinking-mode"
          featureDescription="Enable this to allow the model to think before responding, which can improve response quality."
          labelText="Thinking Mode"
        />

        <FeatureCheckbox
          isActive={isWebSearchMode}
          onToggle={setIsWebSearchMode}
          id="web-search-mode"
          featureDescription="Enable this to allow the model to perform web searches for more up-to-date information."
          labelText="Web Search Mode"
        />
      </div>
    </Modal>
  );
};
