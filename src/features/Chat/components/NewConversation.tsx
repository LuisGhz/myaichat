import { Select } from "antd";
import { MODELS } from "core/const/Models";
import { usePrompts } from "features/Prompts/hooks/usePrompts";
import { useEffect, useMemo } from "react";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";

export const NewConversation = () => {
  const { getAllPrompts, promptsSummary } = usePrompts();
  const { model, promptId } = useChatStore();
  const { setModel, setPromptId } = useChatStoreActions();

  useEffect(() => {
    getAllPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateModelsOptions = useMemo(() => {
    // Group models by developer name
    const groups: Record<
      string,
      {
        label: React.ReactNode;
        title: string;
        options: { label: React.ReactNode; value: string }[];
      }
    > = {};

    for (const m of MODELS) {
      const dev = m.developBy?.name ?? "Unknown";
      if (!groups[dev]) {
        groups[dev] = {
          label: <span className="app-text">{dev}</span>,
          title: dev,
          options: [],
        };
      }
      groups[dev].options.push({
        label: <span>{m.name}</span>,
        value: m.value,
      });
    }

    return Object.values(groups);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">
        Hello, how can I assist you today?
      </h2>
      <section className="flex flex-col gap-4">
        <div>
          <Select
            className="w-56"
            options={generateModelsOptions}
            value={model}
            onChange={(value) => setModel(value as ModelsValues)}
          />
        </div>
        <div>
          <Select
            className="w-56 dark:!bg-gray-800"
            options={promptsSummary.map((prompt) => ({
              value: prompt.id,
              label: prompt.name,
            }))}
            placeholder="Select a prompt if you wish"
            value={promptId}
            onChange={(value) => setPromptId(value as string)}
            allowClear
          />
        </div>
      </section>
    </div>
  );
};
