/* eslint-disable max-len */
export const Spinner: React.FC = ({ ...rest }) => (
  <svg
    {...rest}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="18" stroke="#384D6B" strokeWidth="4" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 2.00003C20 0.895464 19.102 -0.0104713 18.0028 0.0985064C7.89481 1.10066 0 9.62838 0 20C0 24.8007 1.69143 29.2064 4.51087 32.6535C5.11647 33.394 6.18943 33.4948 6.97768 32.9529C8.0022 32.2485 8.11188 30.7803 7.34987 29.7979C5.25003 27.0907 4 23.6914 4 20C4 11.8394 10.1094 5.10576 18.004 4.12333C19.1001 3.98692 20 3.1046 20 2.00003Z"
      fill="#23344F"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 20 20"
        to="360 20 20"
        dur="1s"
        repeatDur="indefinite"
      />
    </path>
  </svg>
);
