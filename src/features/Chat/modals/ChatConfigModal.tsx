import { Modal, Tooltip, Input } from "antd";
import { useState } from "react";
import { FeatureCheckbox } from "../components/FeatureCheckbox";
import { useFormat } from "core/hooks/useFormat";
import { ExclamationCircleIcon } from "icons/ExclamationCircleIcon";

type Props = {
  onClose: (newConfig: ChatConfigOnClose) => void;
  currentMaxOutputTokens: number;
  currentIsWebSearchMode: boolean;
};

export const ChatConfigModal = ({
  onClose,
  currentMaxOutputTokens,
  currentIsWebSearchMode,
}: Props) => {
  const [maxOutputTokens, setMaxOutputTokens] = useState(
    currentMaxOutputTokens
  );
  const [isWebSearchMode, setIsWebSearchMode] = useState(
    currentIsWebSearchMode
  );
  const { fNumber } = useFormat();
  const modalWidth = 360;
  const minTokens = 1000;
  const maxTokensLimit = 8000;

  return (
    <Modal
      className="chat-configuration-modal"
      open
      title="Chat Configuration"
      footer={null}
      width={modalWidth}
      centered
      onCancel={() =>
        onClose({
          maxOutputTokens,
          isWebSearchMode,
        })
      }
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
              <ExclamationCircleIcon
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
            value={maxOutputTokens}
            onChange={(e) => setMaxOutputTokens(Number(e.target.value))}
            aria-describedby="max-tokens-help"
          />
          <div id="max-tokens-help" className="sr-only">
            The maximum number of tokens the model can generate in a single
            response. Minimum {fNumber(minTokens)}, maximum{" "}
            {fNumber(maxTokensLimit)}.
          </div>
        </div>
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
