import { Fragment } from "react";
import { MODELS } from "consts/Models";
import { ModelInfoC } from "./ModelInfo";

export const Welcome = () => {
  return (
    <div className="text-white text-center flex flex-col items-center justify-start h-screen pt-10 overflow-y-auto">
      <h1 className="text-2xl">Welcome to My AI Chat</h1>
      <p className="text-lg mt-2 mb-4">
        This app is designed to help you interact with various AI models. It
        supports the following ones:
      </p>
      <ul>
        {MODELS.map((model, idx) => (
          <Fragment key={idx}>
            {idx === 0 ||
            model.developBy.name !== MODELS[idx - 1].developBy.name ? (
              <li className="text-2xl font-bold mt-4 mb-2 text-start flex gap-3">
                <a className="cursor-pointer" href={model.developBy.link}>
                  <img
                    className="w-6 h-6 mt-1.5"
                    src={model.developBy.imageUrl}
                    alt={model.developBy.name}
                  />
                </a>
                <span>{model.developBy.name}</span>
              </li>
            ) : null}
            <li className="mb-2" key={model.value}>
              <a
                className="text-blue-500 hover:text-blue-400 transition-colors duration-200 cursor-pointer relative flex items-center justify-center gap-2 font-bold"
                href={model.link}
                target="_blank"
              >
                {model.name}
              </a>
              <ModelInfoC model={model} />
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
};
