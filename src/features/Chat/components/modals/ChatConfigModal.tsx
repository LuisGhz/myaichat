import { Modal, Input, Tooltip } from "antd";
import { InformationIcon } from "assets/icons/InformationIcon";
import { useFormat } from "hooks/useFormat";
import { useEffect, useState } from "react";

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
        <div className="mt-4">
          <div
            className={`flex justify-center items-center gap-1 border border-gray-600 rounded-xl w-36 py-2 cursor-pointer transition-colors duration-150 hover:bg-cop-3 ${
              isThinkingMode ? "bg-cop-6" : ""
            }`}
          >
            <label
              htmlFor="thinking-mode"
              className="cursor-pointer flex items-center gap-1"
            >
              Thinking Mode
              <Tooltip
                title="Enable this to allow the model to think before responding, which can improve response quality."
                placement="top"
              >
                <InformationIcon
                  className="size-4"
                  aria-label="Information about thinking mode"
                  role="img"
                />
              </Tooltip>
            </label>
            <input
              className="hidden"
              type="checkbox"
              name="thinking-mode"
              id="thinking-mode"
              checked={isThinkingMode}
              onChange={(e) => setisThinkingMode(e.target.checked)}
              aria-describedby="thinking-mode-help"
            />
          </div>
          <div id="thinking-mode-help" className="sr-only">
            Enable this to allow the model to think before responding, which can
            improve response quality.
          </div>
        </div>
      </div>
    </Modal>
  );
};
