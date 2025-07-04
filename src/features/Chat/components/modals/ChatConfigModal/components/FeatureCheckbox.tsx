import { Tooltip } from "antd";
import { InformationIcon } from "assets/icons/InformationIcon";

type Props = {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  id: string;
  featureDescription: string;
};

export const FeatureCheckbox = ({
  isActive,
  onToggle,
  id,
  featureDescription,
}: Props) => {
  return (
    <div className="mt-4">
      <div
        className={`flex justify-center items-center gap-1 border border-gray-600 rounded-xl w-36 py-2 cursor-pointer transition-colors duration-150 hover:bg-cop-3 ${
          isActive ? "bg-cop-6" : ""
        }`}
      >
        <label
          htmlFor={id}
          className="cursor-pointer flex items-center gap-1"
        >
          {id === "thinking-mode" ? "Thinking Mode" : "Other Mode"}
          <Tooltip title={featureDescription} placement="top">
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
          name={id}
          id={id}
          checked={isActive}
          onChange={(e) => onToggle(e.target.checked)}
          aria-describedby={`${id}-help`}
        />
      </div>
      <div id={`${id}-help`} className="sr-only">
        {featureDescription}
      </div>
    </div>
  );
};
