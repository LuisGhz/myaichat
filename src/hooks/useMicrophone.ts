import { transcribeAudioService } from "services/Microphone.service";
import { useCurrentChatStoreSetIsSendingAudio } from "store/features/chat/useCurrentChatStore";
import { useToast } from "./useToast";

export const useMicrophone = () => {
  const setIsSendingAudio = useCurrentChatStoreSetIsSendingAudio();
  const { toastError } = useToast();

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsSendingAudio(true);
      const result = await transcribeAudioService(audioBlob);
      return result;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toastError("Error transcribing audio. Please try again or try later.");
    } finally {
      setIsSendingAudio(false);
    }
  };

  return {
    transcribeAudio,
  };
};
