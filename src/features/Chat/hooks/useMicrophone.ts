import { useChatStoreActions } from "store/app/ChatStore";
import { transcribeAudioService } from "../services/ChatService";

export const useMicrophone = () => {
  const { setIsSendingAudio } = useChatStoreActions();

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const result = await transcribeAudioService(audioBlob);
      return result;
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setIsSendingAudio(false);
    }
  };

  return {
    transcribeAudio,
  };
};
