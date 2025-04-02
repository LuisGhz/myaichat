import { KeyboardEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "./InputSection.css";
import { useParams } from "react-router";
import { ScreensWidth } from "consts/ScreensWidth";
import { Microphone } from "./Microphone";
import { ArrowUpIcon } from "assets/icons/ArrowUpIcon";
import { AttachFile } from "./AttachFile";

type InputSectionProps = {
  onEnter: (newUserMessage: string) => void;
  isSending: boolean;
};

export const InputSection = ({ onEnter, isSending }: InputSectionProps) => {
  const [userInput, setUserInput] = useState("");
  const textareaContainerRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  useEffect(() => {
    const windowWidth = window.innerWidth;
    if (params.id && windowWidth >= ScreensWidth.smallDesktop)
      textareaContainerRef.current?.focus();
  }, [params.id]);

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) return;
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (userInput.trim().length === 0 || isSending) return;
    onEnter(userInput);
    setUserInput("");
  };

  const onFocusTextarea = () => {
    if (window.innerWidth < ScreensWidth.tablet)
      textareaContainerRef.current?.classList.add("w-full");
  };

  const onBlurTextarea = () => {
    if (window.innerWidth < ScreensWidth.tablet)
      textareaContainerRef.current?.classList.remove("w-full");
  };

  const onTranscription = (text: string) => {
    setUserInput(text);
  };

  return (
    <>
      <section
        className="my-4 flex justify-center items-end bg-cop-5 p-2 rounded-xl w-10/12 md:w-11/12 mx-auto relative overflow-hidden min-h-16"
        aria-label="Message input area"
      >
        <AttachFile />
        <div
          className={`input w-9/12 md:w-10/12 transition-all duration-500 z-10 py-2 px-4 overflow-y-auto flex justify-between hide-scrollbar`}
          ref={textareaContainerRef}
        >
          <label htmlFor="messageInput" className="sr-only">
            Type a message
          </label>
          <TextareaAutosize
            className="outline-none w-10/12 mt-0.5 hide-scrollbar resize-none"
            id="messageInput"
            placeholder="Message MyAIChat"
            onKeyDown={onMessageKeyDown}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            aria-label="Message input"
            role="textbox"
            aria-multiline="true"
            onFocus={onFocusTextarea}
            onBlur={onBlurTextarea}
          />
          <div className="flex items-end">
            {userInput.length > 0 && (
              <button
                className="bg-cop-7 hover:bg-cop-8 transition-colors duration-200 rounded-lg p-1 cursor-pointer"
                type="button"
                aria-label="Send message"
                onClick={sendMessage}
              >
                <ArrowUpIcon className="size-5 " />
              </button>
            )}
          </div>
        </div>
        <Microphone onTranscription={onTranscription} />
      </section>
    </>
  );
};
