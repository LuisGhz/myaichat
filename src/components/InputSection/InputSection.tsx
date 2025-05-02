import { KeyboardEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "./InputSection.css";
import { useParams } from "react-router";
import { ScreensWidth } from "consts/ScreensWidth";
import { Microphone } from "./Microphone";
import { ArrowUpIcon } from "assets/icons/ArrowUpIcon";
import { AttachFile } from "./AttachFile";
import { XMarkIcon } from "assets/icons/XMarkIcon";

type InputSectionProps = {
  onEnter: (newUserMessage: string, file: File | undefined) => void;
  isSending: boolean;
};

export const InputSection = ({ onEnter, isSending }: InputSectionProps) => {
  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const selectedFile = useRef<File | null>(null);
  const textareaContainerRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  useEffect(() => {
    const windowWidth = window.innerWidth;
    if (params.id && windowWidth >= ScreensWidth.smallDesktop)
      textareaContainerRef.current?.focus();
  }, [params.id]);

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey || window.innerWidth < ScreensWidth.smallDesktop)
        return;
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (userInput.trim().length === 0 || isSending) return;
    onEnter(userInput, selectedFile.current || undefined);
    setUserInput("");
    setSelectedImage(null);
    selectedFile.current = null;
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

  const onSelectImage = (file: File) => {
    clearSelectedImage();
    const imageUrl = URL.createObjectURL(file);
    selectedFile.current = file;
    setSelectedImage(imageUrl);
  };

  const clearSelectedImage = () => {
    if (!selectedImage) return;
    URL.revokeObjectURL(selectedImage);
    setSelectedImage(null);
  };

  return (
    <>
      <section
        className="my-4 flex-col bg-cop-1 px-2 pb-2 pt-0.5 rounded-b-xl rounded-t-2xl w-11/12 md:w-10/12 mx-auto relative h-auto"
        aria-label="Message input area"
      >
        <div
          className={`input-container w-full transition-all duration-500 z-10 py-2 px-4 overflow-y-auto bg-cop-1 text-white hide-scrollbar`}
          ref={textareaContainerRef}
        >
          {selectedImage && (
            <div className="w-full max-w-2/12 mb-2 relative">
              <img
                src={selectedImage}
                alt="Selected attachment"
                className="max-h-40 rounded-md object-contain"
              />
              <button
                onClick={clearSelectedImage}
                className="absolute top-1 right-1 bg-cop-8 hover:bg-cop-9 text-white rounded-full p-1 text-xs"
                aria-label="Remove image"
              >
                <XMarkIcon className="size-3 cursor-pointer" />
              </button>
            </div>
          )}
          <div className="flex justify-between hide-scrollbar items-end">
            <label htmlFor="messageInput" className="sr-only">
              Type a message
            </label>
            <TextareaAutosize
              className="message-textarea outline-none w-10/12 mt-0.5 overflow-y-auto resize-none hide-scrollbar"
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
        </div>
        <div className="flex justify-between w-full px-2 mt-1">
          <AttachFile onSelectImage={onSelectImage} />
          <Microphone onTranscription={onTranscription} />
        </div>
      </section>
    </>
  );
};
