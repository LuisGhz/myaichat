import { KeyboardEvent, useEffect, useRef, useState } from "react";
import "./InputSection.css";
// import { PlusIcon } from "assets/icons/PlusIcon";
import { MicrophoneIcon } from "assets/icons/MicrophoneIcon";
import { useParams } from "react-router";

type InputSectionProps = {
  onEnter: (newUserMessage: string) => void;
};

export const InputSection = ({ onEnter }: InputSectionProps) => {
  const [userInput, setUserInput] = useState("");
  const [inputHeight, setInputHeight] = useState(2.5);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number | null>(null);
  const params = useParams();

  useEffect(() => {
    const lines = userInput.split("\n").length;
    const basePx = 16;
    const windowHeight = window.innerHeight;

    // Set a minimum height
    const baseHeight = 2.5;
    // Only add extra height for additional lines
    const extraLinesHeight = (lines - 1) * 1.5;
    const newInputHeight = baseHeight + extraLinesHeight;
    // Only restore cursor position if we have a saved position
    // (from Shift+Enter operation)
    if (cursorPositionRef.current !== null && textarea.current) {
      // Scroll to the bottom of the textarea
      const textareaTextLength = textarea.current.textLength;
      if (
        inputHeight !== newInputHeight &&
        textareaTextLength === cursorPositionRef.current
      ) {
        textarea.current.scrollTop = newInputHeight * basePx;
      }
      const pos = cursorPositionRef.current;
      textarea.current.selectionStart = pos;
      textarea.current.selectionEnd = pos;
      textarea.current.focus();
      cursorPositionRef.current = null; // Reset after use
    }

    if (newInputHeight * basePx > windowHeight * 0.8) return;
    setInputHeight(newInputHeight);
    // Don't auto-scroll when user is editing - let the browser handle it naturally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput]);

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Handle Shift+Enter action
        event.preventDefault();

        const textareaC = textarea.current;
        if (textareaC) {
          const start = textareaC.selectionStart;
          const end = textareaC.selectionEnd;

          // Insert new line at cursor position
          const newValue =
            userInput.substring(0, start) + "\n" + userInput.substring(end);

          // Save the position where the cursor should be after the update
          cursorPositionRef.current = start + 1;

          setUserInput(newValue);
        }
        return;
      }
      event.preventDefault();
      if (userInput.trim().length === 0) return;
      onEnter(userInput);
      setUserInput("");
    }
  };

  useEffect(() => {
    if (params.id) textarea.current?.focus();
  }, [params.id]);

  return (
    <>
      <section className="my-2 flex bg-cop-5 p-2 justify-evenly rounded-xl">
        {/* TODO: ADD files interation */}
        {/* <span className="text-white mt-2 cursor-pointer">
          <PlusIcon />
        </span> */}
        <textarea
          className="input py-2 px-4 overflow-hidden"
          style={{ height: `${inputHeight}rem` }}
          ref={textarea}
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
