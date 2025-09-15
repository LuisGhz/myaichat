import { Select } from "antd";

export const NewConversation = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">
        Hello, how can I assist you today?
      </h2>
      <section className="flex flex-col gap-4">
        <div>
          <Select
            className="w-56"
            options={[
              { value: "gem-2.0", label: "Gemini 2.0" },
              { value: "gpt-4om", label: "GPT 4o mini" },
              { value: "gpt-5", label: "GPT 5" },
            ]}
            value={"gem-2.0"}
          />
        </div>
        <div>
          <Select
            className="w-56 dark:!bg-gray-800"
            options={[
              { value: "oj12o3ij1oi2ejd", label: "Tech interview" },
              { value: "asdasd1221d", label: "Barra coba" },
              { value: "asda1wqdd12d", label: "English teacher" },
            ]}
            placeholder="Select a prompt if you wish"
          />
        </div>
      </section>
    </div>
  );
};
