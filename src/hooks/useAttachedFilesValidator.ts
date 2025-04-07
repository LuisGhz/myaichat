export const useAttachedFilesValidator = () => {
  const MB = 2;
  const MAX_FILE_SIZE = MB * 1024 * 1024;

  const validateFiles = (file: File) => {
    return file.size <= MAX_FILE_SIZE && file.type.includes("image/");
  };

  return { validateFiles };
};
