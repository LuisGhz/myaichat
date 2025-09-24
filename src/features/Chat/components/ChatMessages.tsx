import { Fragment } from "react";
import { AssistantTyping } from "./AssistantTyping";
import { ChatFileViewer } from "./ChatFileViewer";
import { MessageActionButtons } from "./MessageActionButtons";
import { useMarkDown } from "../hooks/useMarkdown";

type Props = {
  messages: ChatMessage[];
};

export const ChatMessages = ({ messages }: Props) => {
  const formatToMarkDown = useMarkDown();

  return (
    <section className="px-1 md:px-2">
      <ul className="flex flex-col gap-10">
        {messages.map((msg, idx) =>
          msg.content.trim() === "" ? (
            msg.role === "Assistant" ? (
              <AssistantTyping key={idx} />
            ) : (
              <Fragment key={idx}></Fragment>
            )
          ) : (
            <li className="flex flex-col" key={idx}>
              {msg.file && msg.role === "User" && (
                <div className="self-end mb-2">
                  <ChatFileViewer file={msg.file} />
                </div>
              )}
              <div
                className={`${
                  msg.role === "User" ? "self-end" : "self-start"
                } max-w-[70%] p-3 rounded-lg app-text bg-gray-300 dark:bg-gray-950 relative`}
              >
                <div className="text-[1rem]">{formatToMarkDown(msg.content)}</div>
                {((msg.completionTokens || 0) > 0 ||
                  (msg.promptTokens || 0) > 0) && (
                  <>
                    <span className="text-xs block mt-1.5 app-text">
                      Tokens:{" "}
                      {msg.role === "User"
                        ? msg.promptTokens
                        : msg.completionTokens}
                    </span>
                    <MessageActionButtons
                      role={msg.role}
                      content={msg.content}
                    />
                  </>
                )}
              </div>
              {msg.file && msg.role === "Assistant" && (
                <div className="self-start mt-2">
                  <ChatFileViewer file={msg.file} />
                </div>
              )}
            </li>
          )
        )}
      </ul>
    </section>
  );
};
