import { KeyboardEvent, useState } from "react";
import "./InputSection.css";

type InputSectionProps = {
  onEnter: (newUserMessage: string) => void;
};

export const InputSection = ({ onEnter }: InputSectionProps) => {
  const [userInput, setUserInput] = useState("");

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (userInput.trim().length === 0) return;
      onEnter(userInput);
      setUserInput("");
    }
  };

  return (
    <>
      <section className="my-2 flex bg-input-section p-2 justify-evenly">
        <span>+</span>
        <textarea
          className="input py-2 px-4"
          placeholder="Message MyAIChat"
          onKeyDown={onMessageKeyDown}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>
        <span>Microphone</span>
      </section>
    </>
  );
};
