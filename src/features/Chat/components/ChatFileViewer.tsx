import { Image } from "antd";
import { useEffect, useState } from "react";

type Props = {
  file: File | string;
};

export const ChatFileViewer = ({ file }: Props) => {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setIsImage(file.type.startsWith("image/"));
      return () => URL.revokeObjectURL(url);
    }

    if (typeof file === "string") {
      setFileUrl(file);
      setIsImage(file.match(/\.(jpeg|jpg|gif|png|svg)$/) != null);
    }
  }, [file]);

  return (
    <div>
      {isImage ? (
        <Image className="!max-w-40" src={fileUrl} alt="Uploaded file" />
      ) : (
        <p>Another file type</p>
      )}
    </div>
  );
};
