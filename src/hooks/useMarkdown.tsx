import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const useMarkDown = () => {
  const formatToMarkDown = (text: string) => {
    return <ReactMarkdown remarkPlugins={[remarkGfm]} >{text}</ReactMarkdown>
  }

  return formatToMarkDown;
}