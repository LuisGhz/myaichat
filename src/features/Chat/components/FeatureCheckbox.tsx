import { Tooltip } from "antd";
import { ExclamationCircleIcon } from "icons/ExclamationCircleIcon";

type Props = {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  id: string;
  featureDescription: string;
  labelText: string;
};

export const FeatureCheckbox = ({
  isActive,
  onToggle,
  id,
  featureDescription,
  labelText,
}: Props) => {
  return (
    <div className="mt-4">
      <div
        className={`flex justify-center items-center gap-1 border border-gray-600 rounded-xl max-w-max p-2 cursor-pointer transition-colors duration-150 hover:bg-cop-3 ${
          isActive ? "bg-gray-200 dark:bg-gray-950" : ""
        }`}
      >
        <label
          htmlFor={id}
          className="cursor-pointer flex items-center gap-1"
          aria-label={`Information about ${labelText}`}
        >
          {labelText}
          <Tooltip title={featureDescription} placement="top">
            <ExclamationCircleIcon
              className="size-3 fill-gray-700 dark:fill-gray-200 ms-0.5"
              aria-label={`Information about ${labelText} icon`}
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
