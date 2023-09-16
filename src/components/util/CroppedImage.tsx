import { Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function CroppedImage({ imgSrc }: { imgSrc: string }) {
  const [clipPath, setClipPath] = useState<string>("");

  useEffect(() => {
    const image = new window.Image();
    image.src = imgSrc;

    const onLoad = () => {
      const height = image.height;
      const clipHeight = height * 0.05;
      setClipPath(`inset(0px 0px ${clipHeight}px 0px)`);
    };

    image.addEventListener("load", onLoad);

    return () => {
      image.removeEventListener("load", onLoad);
    };
  }, [imgSrc]);

  return <Image src={imgSrc} objectFit="cover" clipPath={clipPath} />;
}
