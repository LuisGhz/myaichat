import { useState } from "react";
import { transcribeAudioService } from "services/Microphone.service";

export const useMicrophone = () => {
  const [isSendingAudio, setIsSendingAudio] = useState(false);

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsSendingAudio(true);
    const result = await transcribeAudioService(audioBlob);
    setIsSendingAudio(false);
    return result;
  };

  return {
    transcribeAudio,
    isSendingAudio,
  };
};
