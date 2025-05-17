import { TouchEvent } from "react";
import { MODELS } from "consts/Models";
import "./Welcome.css";
import { ModelInfoC } from "./ModelInfo";
import { useState } from "react";

export const Welcome = () => {
  const [visibleModel, setVisibleModel] = useState<string | null>(null);
  let touchTimer: ReturnType<typeof setTimeout>;

  const handleTouchStart =
    (modelValue: string, isLink: boolean) => (e: TouchEvent<HTMLElement>) => {
      e.preventDefault();
      touchTimer = setTimeout(() => {
        if (isLink) {
          e.stopPropagation();
          e.preventDefault();
          setVisibleModel(modelValue);
        }
      }, 500); // Long touch threshold
    };

  const handleTouchEnd =
    (modelValue: string, isLink: boolean) => (e: TouchEvent<HTMLElement>) => {
      e.stopPropagation();
      clearTimeout(touchTimer);
      if (!isLink)
        setVisibleModel((prev) => (prev === modelValue ? null : modelValue));
    };

  return (
    <div className="text-white text-center flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Welcome to My AI Chat</h1>
      <p>It supports the following models</p>
      <ul>
        {MODELS.map((model) => (
          <li
            className={`link-container text-lg ${
              visibleModel === model.value ? "link-container--active" : ""
            } `}
            key={model.value}
            onTouchStart={handleTouchStart(model.value, false)}
            onTouchEnd={handleTouchEnd(model.value, false)}
          >
            <a
              className="text-blue-500 hover:text-blue-400 transition-colors duration-100 cursor-pointer relative"
              href={model.link}
              target="_blank"
              onTouchStart={handleTouchStart(model.value, true)}
              onTouchEnd={handleTouchEnd(model.value, true)}
            >
              {model.name}
            </a>
            <ModelInfoC model={model} />
          </li>
        ))}
      </ul>
    </div>
  );
};
