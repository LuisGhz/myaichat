import { MODELS } from "consts/Models";

export const Prompts = () => {
  return (
    <>
      <div className="flex flex-col h-full items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Prompt</h1>
        <p className="text-lg mt-4">Create a new prompt here.</p>
        <div className="mt-6">
          <input
            type="text"
            className="w-96 p-2 bg-gray-800 text-white rounded-md"
            placeholder="Enter prompt title..."
          />
        </div>
        <div className="mt-6">
          <select className="w-96 p-2 bg-gray-800 text-white rounded-md">
            <option value="" disabled selected>
              Select a model
            </option>
            {MODELS.map(({ name, value }) => (
              <option
                key={value}
                value={value}
                className="bg-gray-800 text-white"
              >
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <textarea
            className="w-96 h-48 p-2 bg-gray-800 text-white rounded-md"
            placeholder="Type your prompt here..."
          ></textarea>
        </div>
      </div>
    </>
  );
};
