import { toast } from "react-toastify";

export const useToast = () => {
  const autoCloseError = 2000;
  const autoCloseSuccess = 1000;
  const position = "top-right";
  const theme = "dark";

  const toastSuccess = (message: string) => {
    toast.success(message, {
      autoClose: autoCloseSuccess,
      position,
      theme,
    });
  };

  const toastError = (message: string) => {
    toast.error(message, {
      autoClose: autoCloseError,
      position,
      theme,
    });
  };

  return { toastSuccess, toastError };
};
