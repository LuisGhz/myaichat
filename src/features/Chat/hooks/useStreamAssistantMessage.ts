import { useCallback, useEffect, useRef, useState } from "react";
import { useChatStoreActions } from "store/app/ChatStore";
import { streamAssistantMessageService } from "../services/ChatService";

// Hook for manually triggered streaming of assistant messages
export const useStreamAssistantMessage = () => {
  const [chunks, setChunks] = useState<AssistantChunkRes[]>([]);
  const [fullText, setFullText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  
  const { addStreamingAssistantMessage, updateStreamingAssistantMessage } = useChatStoreActions();

  // Debug effect to track chunks changes
  useEffect(() => {
    console.log("Chunks state updated:", chunks);
  }, [chunks]);

  // Debug effect to track fullText changes
  useEffect(() => {
    console.log("FullText state updated:", fullText);
  }, [fullText]);

  const startStreaming = useCallback(async (chatId: string) => {
    // console.log("Starting streaming for chat ID:", chatId);
    
    // Abort any existing stream
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    
    setIsStreaming(true);
    setError(null);
    setChunks([]);
    setFullText("");
    
    // Add a new empty assistant message to the chat store
    addStreamingAssistantMessage();

    try {
      console.log("Calling streamAssistantMessageService...");
      await streamAssistantMessageService(
        chatId,
        (chunk: AssistantChunkRes) => {
          // console.log("Chunk received in hook:", chunk);
          setChunks(prev => {
            const newChunks = [...prev, chunk];
            // console.log("Updated chunks state:", newChunks);
            return newChunks;
          });
          setFullText(prev => {
            const newText = prev + chunk.content;
            // console.log("Updated fullText state:", newText);
            
            // Update the assistant message in the chat store with accumulated content
            updateStreamingAssistantMessage(newText);
            
            return newText;
          });
        },
        controller.signal
      );
      // console.log("Stream completed successfully");
    } catch (err) {
      console.error("Stream error in hook:", err);
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }, [addStreamingAssistantMessage, updateStreamingAssistantMessage]);

  const stopStreaming = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return {
    chunks,
    fullText,
    isStreaming,
    error,
    startStreaming,
    stopStreaming,
  };
};
