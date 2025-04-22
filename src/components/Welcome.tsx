import { MODELS } from "consts/Models";

export const Welcome = () => {
  return (
    <div className="text-white text-center pt-10">
      <h1 className="text-2xl">Welcome to My AI Chat</h1>
      <p>It supports the following models</p>
      <ul>
        {
          MODELS.map((model) => (
            <li key={model.value} className="text-lg">
              {model.name}
            </li>
          ))
        }
      </ul>
    </div>
  );
};
