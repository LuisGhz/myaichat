import { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
type Props = {
  file: File | string;
};

export const ImageViewer = ({ file }: Props) => {
  const [finalImage, setFinalImage] = useState<string>("");

  useEffect(() => {
    if (typeof file === "string") {
      setFinalImage(file);
    } else {
      const imageUrl = URL.createObjectURL(file);
      setFinalImage(imageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    finalImage !== "" && (
      <>
        <PhotoProvider maskOpacity={0.8} bannerVisible={false}>
          <PhotoView src={finalImage}>
            <img
              className="w-48 mb-3 rounded-sm cursor-pointer"
              src={finalImage}
              alt="File uploaded by user"
            />
          </PhotoView>
        </PhotoProvider>
      </>
    )
  );
};
