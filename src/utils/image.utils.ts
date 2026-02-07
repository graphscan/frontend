import { SyntheticEvent } from "react";

export const onImageLoadError = (e: SyntheticEvent<HTMLImageElement>) =>
  (e.currentTarget.src = "/images/no-data.svg");
