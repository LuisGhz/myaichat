import { useParams } from "react-router";

type ChatParams = {
  id: string;
};

export const useChatParams = () => {
  const params = useParams<ChatParams>();
  return params;
};
