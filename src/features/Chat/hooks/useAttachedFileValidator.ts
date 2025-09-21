export const useAttachedFilesValidator = () => {
  const MB = 2;
  const MAX_FILE_SIZE = MB * 1024 * 1024;

  const validateFiles = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    return file.size <= MAX_FILE_SIZE && allowedTypes.includes(file.type);
  };

  return { validateFiles };
};
