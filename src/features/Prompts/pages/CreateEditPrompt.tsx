import { useNavigate } from "react-router";
import { Input, Button } from "antd";
import { BaselinePlusIcon } from "icons/BaselinePlusIcon";

const { TextArea } = Input;

export const CreateEditPrompt = () => {
  const navigate = useNavigate();

  return (
    <form className="flex items-center h-full flex-col gap-4">
      <h2 className="text-xl app-text font-semibold">Prompt</h2>
      <p className="app-text">Create a prompt here.</p>
      <section className="flex flex-col gap-2 w-full items-center">
        <Input className="!w-10/12 max-w-96" placeholder="Prompt Title" />
        <TextArea
          className="scroll-hidden !w-10/12 !max-w-96"
          placeholder="Prompt Content"
          autoSize={{ minRows: 4, maxRows: 8 }}
        />
      </section>
      <section className="w-10/12 max-w-96">
        <section className="flex justify-between items-center">
          <span className="app-text font-semibold text-lg">Messages</span>
          <button aria-label="Add Message" title="Add Message" type="button">
            <BaselinePlusIcon className="text-green-600 dark:text-green-300 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-200 w-7 h-7 cursor-pointer" />
          </button>
        </section>
        <section>
          <p className="app-text">No messages yet.</p>
        </section>
      </section>
      <section className="flex gap-8">
        <Button
          className="w-30"
          type="primary"
          htmlType="button"
          onClick={() => navigate("/prompts")}
        >
          Go back
        </Button>
        <Button className="w-30" type="primary" htmlType="submit">
          Save Prompt
        </Button>
      </section>
    </form>
  );
};
