import { transcribeAudioService } from "services/Microphone.service";
import { useCurrentChatStoreSetIsSendingAudio } from "store/features/chat/useCurrentChatStore";

export const useMicrophone = () => {
  const setIsSendingAudio = useCurrentChatStoreSetIsSendingAudio();

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsSendingAudio(true);
    const result = await transcribeAudioService(audioBlob);
    setIsSendingAudio(false);
    return result;
  };

  return {
    transcribeAudio,
  };
};
