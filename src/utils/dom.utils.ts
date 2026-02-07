import { useEffect, useRef, useState } from "react";

export const useBodyScrollLock = (active: boolean) => {
  const [prevActive, setPrevActive] = useState(active);

  const verticalPosition = useRef(0);
  useEffect(() => {
    const { body } = document;

    const removeBodyInlineStyles = () => {
      ["overflow", "position", "top", "width"].forEach((x) =>
        body.style.removeProperty(x),
      );
      setPrevActive(false);
    };

    if (active) {
      if (window.scrollY !== 0) {
        verticalPosition.current = window.scrollY;
      }
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.width = "100%";
      body.style.top = `-${verticalPosition.current}px`;
      setPrevActive(active);
    } else if (!active && prevActive) {
      removeBodyInlineStyles();
      window.scrollTo({ top: verticalPosition.current });
      verticalPosition.current = 0;
    }

    return removeBodyInlineStyles;
  }, [active, prevActive]);
};
