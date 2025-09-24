import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useChatStoreActions } from "store/app/ChatStore";
import { streamAssistantMessageService } from "../services/ChatService";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";
import { useChatParams } from "./useChatParams";

export const useStreamAssistantMessage = () => {
  const [fullText, setFullText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const { chatsSummary } = useAppStore();
  const { setChatsSummary, setIsGettingNewChat } = useAppStoreActions();
  const {
    addStreamingAssistantMessage,
    updateStreamingAssistantMessage,
    addStreamingAssistanteAndUserMessageTokens,
  } = useChatStoreActions();
  const navigate = useNavigate();
  const params = useChatParams();

  const handleChunk = (chatId: string, chunk: AssistantChunkRes) => {
    // Calculate the new text first
    setFullText((prev) => {
      const newText = prev + chunk.content;
      // Update the assistant message in the chat store after state update
      setTimeout(() => {
        if (chunk.content !== null && chunk.content !== undefined)
          updateStreamingAssistantMessage(newText);
      }, 0);
      return newText;
    });

    if (chunk.isLastChunk) {
      setIsGettingNewChat(false);
      addStreamingAssistanteAndUserMessageTokens(
        chunk.promptTokens || 0,
        chunk.completionTokens || 0
      );
      if (!params.id)
        navigate(`/chat/${chatId}`, {
          state: { fromStream: true },
        });
      if (chatsSummary.find((chat) => chat.id === chatId)) return;
      setChatsSummary([
        ...chatsSummary,
        { id: chatId, title: chunk.chatTitle, fav: false },
      ]);
    }
  };

  const startStreaming = async (chatId: string) => {
    // console.log("Starting streaming for chat ID:", chatId);

    // Abort any existing stream
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setIsStreaming(true);
    setError(null);
    setFullText("");

    // Add a new empty assistant message to the chat store
    addStreamingAssistantMessage();

    try {
      await streamAssistantMessageService(
        chatId,
        (chunk: AssistantChunkRes) => handleChunk(chatId, chunk),
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
  };

  const stopStreaming = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return {
    fullText,
    isStreaming,
    error,
    startStreaming,
    stopStreaming,
  };
};
