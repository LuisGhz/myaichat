import { ModelInfo } from "core/const/Models";
import { useFormat } from "core/hooks/useFormat";

type Props = {
  model: ModelInfo;
};

export const ModelInfoC = ({ model }: Props) => {
  const { fNumber, fCurrency } = useFormat();

  return (
    <section className="metadata bottom-full left-0">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "8px",
          minWidth: 220,
          maxWidth: 480,
          width: "100%",
          padding: "8px 0",
        }}
      >
        <div style={{ fontWeight: 600 }}>Context Window</div>
        <div>{fNumber(model.metadata.contextWindow)}</div>
        <div style={{ fontWeight: 600 }}>Max Output Tokens</div>
        <div>{fNumber(model.metadata.maxOutputTokens)}</div>
        <div style={{ fontWeight: 600 }}>Knowledge Cutoff</div>
        <div>{model.metadata.knowledgeCutoff}</div>
        <div style={{ fontWeight: 600 }}>Price</div>
        <div>
          Input: {fCurrency(model.price.input, { maximumFractionDigits: 3 })} /
          Output: {fCurrency(model.price.output, { maximumFractionDigits: 2 })}
        </div>
      </div>
    </section>
  );
};
