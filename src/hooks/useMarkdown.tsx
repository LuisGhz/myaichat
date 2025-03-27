import ReactMarkdown from 'react-markdown';

export const useMarkDown = () => {
  const formatToMarkDown = (text: string) => {
    return <ReactMarkdown>{text}</ReactMarkdown>
  }

  return formatToMarkDown;
}