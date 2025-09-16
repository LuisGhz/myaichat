import { apiClient } from "api"

export const SideNavService = () => {
  const getChatSummary = async () => {
    return await apiClient.get<ChatSummaryRes>("/chat/all");
  };

  return { getChatSummary };
}