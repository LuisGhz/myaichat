import { MODELS } from "consts/Models";
import "./Welcome.css";
import { useFormat } from "hooks/useFormat";

export const Welcome = () => {
  const { fNumber, fCurrency } = useFormat();

  return (
    <div className="text-white text-center flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Welcome to My AI Chat</h1>
      <p>It supports the following models</p>
      <ul>
        {MODELS.map((model) => (
          <li className="link-container text-lg" key={model.value}>
            <a
              className="text-blue-500 underline cursor-pointer relative"
              href={model.link}
              target="_blank"
            >
              {model.name}
            </a>
            <section className="metadata bottom-full left-0">
              <p className="font-bold">{model.name}</p>
              <p>Context Window: {fNumber(model.metadata.contextWindow)}</p>
              <p>Max Output Tokens: {model.metadata.maxOutputTokens}</p>
              <p>Knowledge Cutoff: {model.metadata.knowledgeCutoff}</p>
              <p>
                Price: Input: {fCurrency(model.price.input)} / Output:
                {' '}{fCurrency(model.price.output)}
              </p>
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
};
