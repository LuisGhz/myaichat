import { useMemo, useState } from "react";
import { Modal, Tooltip, Input } from "antd";
import { z } from "zod";
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
  const [maxTokensError, setMaxTokensError] = useState<string | null>(null);
  const { fNumber } = useFormat();
  const modalWidth = 360;
  const minTokens = 1000;
  const maxTokensLimit = 8000;

  const maxTokensSchema = useMemo(
    () =>
      z
        .number()
        .int("Must be an integer")
        .min(minTokens, `Must be at least ${fNumber(minTokens)}`)
        .max(maxTokensLimit, `Must be at most ${fNumber(maxTokensLimit)}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minTokens, maxTokensLimit]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "." || e.key === ",") {
      e.preventDefault();
    }
  };

  const validateMaxTokens = () => {
    const result = maxTokensSchema.safeParse(maxOutputTokens);
    if (!result.success) {
      setMaxTokensError(result.error.issues[0].message);
      return false;
    }
    setMaxTokensError(null);
    return true;
  };

  return (
    <Modal
      className="chat-configuration-modal"
      open
      title="Chat Configuration"
      footer={null}
      width={modalWidth}
      centered
      onCancel={() => {
        if (maxTokensError !== null) return;
        onClose({
          maxOutputTokens,
          isWebSearchMode,
        });
      }}
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
                className="size-3 fill-gray-700 dark:fill-gray-200"
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
            onKeyDown={handleKeyDown}
            onBlur={validateMaxTokens}
            aria-describedby="max-tokens-help"
          />
          <div id="max-tokens-help" className="sr-only">
            The maximum number of tokens the model can generate in a single
            response. Minimum {fNumber(minTokens)}, maximum{" "}
            {fNumber(maxTokensLimit)}.
          </div>
          {maxTokensError && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {maxTokensError}
            </p>
          )}
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
