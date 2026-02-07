import { ImageContainer } from "./robohash-image.styled";
import { useEffect, useState } from "react";

type Props = {
  accountId: string;
  size: number;
};

export const RobohashImage: React.FC<Props> = ({ accountId, size }) => {
  const [src, setSrc] = useState("");
  const imageSrc = `https://robohash.org/${accountId}`;

  useEffect(() => {
    fetch(imageSrc)
      .then(() => {
        setSrc(imageSrc);
      })
      .catch(() =>
        setTimeout(
          () =>
            fetch(imageSrc)
              .then(() => {
                setSrc(imageSrc);
              })
              .catch(() =>
                setTimeout(
                  () =>
                    fetch(imageSrc)
                      .then(() => {
                        setSrc(imageSrc);
                      })
                      .catch(() => {
                        setSrc("/images/no-data.svg");
                      }),
                  1000,
                ),
              ),
          500,
        ),
      );
  }, [imageSrc]);

  return (
    <ImageContainer size={size}>
      {src.length > 0 && <img src={src} alt="Robohash image" />}
    </ImageContainer>
  );
};
