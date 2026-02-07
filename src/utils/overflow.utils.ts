import { useCallback, useEffect, useRef, useState } from "react";

export const useIsOverflow = <T extends HTMLElement = HTMLDivElement>(
  dimension: "vertical" | "horisontal",
) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const ref = useRef<T>(null);

  const checkIsOverflow = useCallback(() => {
    const el = ref.current;

    const size = dimension === "vertical" ? "Height" : "Width";

    if (el) {
      setIsOverflow(el[`client${size}`] < el[`scroll${size}`]);
    }
  }, [dimension]);

  useEffect(() => {
    document.fonts.ready.then(() => checkIsOverflow());
  }, [checkIsOverflow]);

  return {
    ref,
    isOverflow,
    checkIsOverflow,
  };
};
