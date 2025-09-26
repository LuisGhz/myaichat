import { useAppStore } from "store/app/AppStore";

export const useAppMessage = () => {
  const { messageApi } = useAppStore();

  const infoMessage = (content: string) => {
    messageApi?.info({
      type: "info",
      content,
      duration: 3,
    });
  };

  const successMessage = (content: string) => {
    messageApi?.success({
      type: "success",
      content,
      duration: 3,
    });
  };

  const errorMessage = (content: string) => {
    messageApi?.error({
      type: "error",
      content,
      duration: 4,
    });
  };

  const warningMessage = (content: string) => {
    messageApi?.warning({
      type: "warning",
      content,
      duration: 4,
    });
  };

  return { successMessage, errorMessage, infoMessage, warningMessage };
};
