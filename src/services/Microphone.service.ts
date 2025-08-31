import { authenticatedApiClient } from "api/auth.api";
import { TranscribedRes } from "types/microphone/TranscribedRes.type";

export const transcribeAudioService = async (audioBlob: Blob) => {
  const formData = new FormData();
  const audioFile = new File([audioBlob], "audio.wav", {
    type: audioBlob.type,
  });
  formData.append("audio", audioFile);

  const response = await authenticatedApiClient.postFormData<TranscribedRes>(
    "/audio/transcribe",
    formData
  );
  return response;
};
