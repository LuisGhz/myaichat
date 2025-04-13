import { toast } from "react-toastify";

export const useToast = () => {
  const autoClose = 2000;
  const position = "top-right";
  const theme = "dark";

  const toastSuccess = (message: string) => {
    toast.success(message, {
      autoClose,
      position,
      theme,
    });
  };

  const toastError = (message: string) => {
    toast.error(message, {
      autoClose,
      position,
      theme,
    });
  };

  return { toastSuccess, toastError };
};
