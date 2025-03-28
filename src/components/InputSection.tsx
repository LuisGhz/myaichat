import { KeyboardEvent, useState } from "react";
import "./InputSection.css";
import { PlusIcon } from "assets/icons/PlusIcon";
import { MicrophoneIcon } from "assets/icons/MicrophoneIcon";

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
      <section className="my-2 flex bg-cop-5 p-2 justify-evenly">
        <span className="text-white mt-2 cursor-pointer">
          <PlusIcon />
        </span>
        <textarea
          className="input py-2 px-4"
          placeholder="Message MyAIChat"
          onKeyDown={onMessageKeyDown}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>
        <span className="text-white mt-2 cursor-pointer">
          <MicrophoneIcon />
        </span>
      </section>
    </>
  );
};
