import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { CodeBlock } from "../components/CodeBlock";

export const useMarkDown = () => {
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const isCodeBlock = match && className?.includes("language-");

      if (!isCodeBlock) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return <CodeBlock className={className}>{children}</CodeBlock>;
    },
  };

  const formatToMarkDown = (text: string) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    );
  };

  return formatToMarkDown;
};
