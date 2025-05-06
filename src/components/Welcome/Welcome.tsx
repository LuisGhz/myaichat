import { MODELS } from "consts/Models";
import "./Welcome.css";
import { ModelInfoC } from "./ModelInfo";

export const Welcome = () => {
  return (
    <div className="text-white text-center flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Welcome to My AI Chat</h1>
      <p>It supports the following models</p>
      <ul>
        {MODELS.map((model) => (
          <li className="link-container text-lg" key={model.value}>
            <a
              className="text-blue-500 cursor-pointer relative"
              href={model.link}
              target="_blank"
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
