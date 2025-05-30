import { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
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
    finalImage !== "" && (
      <>
        <PhotoProvider maskOpacity={0.8} bannerVisible={false}>
          <PhotoView src={finalImage}>
            <img
              className="w-48 mb-3 rounded-sm cursor-pointer"
              src={finalImage}
              alt="Image uploaded by user"
            />
          </PhotoView>
        </PhotoProvider>
      </>
    )
  );
};
