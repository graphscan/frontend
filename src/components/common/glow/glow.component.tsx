import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { useMounted } from "../../../utils/ssr.utils";

const StyledGlow = styled.img<{ top?: string; left?: string }>`
  position: absolute;
  max-width: initial;
  top: ${({ top }) => (top ? top : "50%")};
  left: ${({ left }) => (left ? left : "50%")};
  transform: translate(-50%, -50%);
  z-index: -1;
`;

type Props = {
  src: string;
  top?: string;
  left?: string;
};

export const Glow: React.FC<Props> = ({ src, top, left }) => {
  const mounted = useMounted();
  const isDesktop = useMediaQuery({ minWidth: 960 });

  return mounted && isDesktop ? (
    <StyledGlow src={src} top={top} left={left} alt="Glow" />
  ) : null;
};
