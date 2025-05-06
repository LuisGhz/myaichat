import { ModelInfo } from "consts/Models";
import { useFormat } from "hooks/useFormat";

type Props = {
  model: ModelInfo;
};

export const ModelInfoC = ({ model }: Props) => {
  const { fNumber, fCurrency } = useFormat();

  return (
    <section className="metadata bottom-full left-0">
      <p className="font-bold">{model.name}</p>
      <p>Context Window: {fNumber(model.metadata.contextWindow)}</p>
      <p>Max Output Tokens: {model.metadata.maxOutputTokens}</p>
      <p>Knowledge Cutoff: {model.metadata.knowledgeCutoff}</p>
      <p>
        Price: Input: {fCurrency(model.price.input)} / Output:{" "}
        {fCurrency(model.price.output)}
      </p>
    </section>
  );
};
