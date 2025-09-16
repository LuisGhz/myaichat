import { SideNavService } from "core/services/SideNavService";
import { useState } from "react";

const sideNavService = SideNavService();

export const useSideNav = () => {
  const [chatsSummary, setChatsSummary] = useState<ChatSummary[]>([]);

  const getChatsSummary = async () => {
    const res = await sideNavService.getChatSummary();
    setChatsSummary(res?.chats || []);
  };

  return { getChatsSummary, chatsSummary };
};
