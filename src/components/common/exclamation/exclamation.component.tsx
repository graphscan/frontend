import { Container } from "./exclamation.styled";

type Props = {
  color: "#ff2055" | "#f86342";
  tooltipText: string;
  isHtml?: boolean;
};

export const Exclamation: React.FC<Props> = ({
  color,
  tooltipText,
  isHtml = false,
}) => {
  return (
    <Container
      data-tip={tooltipText}
      data-background-color={color}
      data-arrow-color={color}
      data-text-color="#fff"
      data-html={isHtml}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dexcl)">
          <circle cx="12" cy="11" r="6" fill={color} />
        </g>
        <path
          // eslint-disable-next-line max-len
          d="M10.7637 7.3H13.2497L12.8317 12.195H11.1707L10.7637 7.3ZM12.0067 15.099C11.64 15.099 11.3394 14.989 11.1047 14.769C10.87 14.5417 10.7527 14.2667 10.7527 13.944C10.7527 13.614 10.87 13.3427 11.1047 13.13C11.3394 12.9173 11.64 12.811 12.0067 12.811C12.3734 12.811 12.6704 12.9173 12.8977 13.13C13.1324 13.3427 13.2497 13.614 13.2497 13.944C13.2497 14.2667 13.1324 14.5417 12.8977 14.769C12.663 14.989 12.366 15.099 12.0067 15.099Z"
          fill="white"
        />
        <defs>
          <filter
            id="filter0_dexcl"
            x="0"
            y="0"
            width="24"
            height="24"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 0.12549 0 0 0 0 0.333333 0 0 0 0.55 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </Container>
  );
};
