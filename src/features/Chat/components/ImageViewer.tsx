import { useEffect, useState } from "react";

type Props = {
  image: File | string;
};

export const ImageViewer = ({ image }: Props) => {
  const [finalImage, setFinalImage] = useState<string>("");

  useEffect(() => {
    if (typeof image === "string") {
      setFinalImage(image);
    } else {
      const imageUrl = URL.createObjectURL(image);
      setFinalImage(imageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <img
        className="w-48 mb-3 rounded-sm"
        src={finalImage}
        alt="Image uploaded by user"
      />
    </>
  );
};
