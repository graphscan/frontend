import ReactSwitch, { ReactSwitchProps } from "react-switch";

export const Switch: React.FC<ReactSwitchProps> = ({
  width,
  height,
  borderRadius,
  handleDiameter,
  offColor = "#243855",
  onColor = "#203451",
  offHandleColor = "#3b5170",
  onHandleColor = "#3E7CF4",
  activeBoxShadow = "0px 1px 10px rgba(62, 124, 244, 0.6)",
  checkedIcon = false,
  uncheckedIcon = false,
  ...rest
}) => {
  return (
    <ReactSwitch
      width={width ?? 40}
      height={height ?? 21}
      handleDiameter={handleDiameter ?? 17}
      borderRadius={borderRadius ?? 30}
      offColor={offColor}
      onColor={onColor}
      offHandleColor={offHandleColor}
      onHandleColor={onHandleColor}
      activeBoxShadow={activeBoxShadow}
      checkedIcon={checkedIcon}
      uncheckedIcon={uncheckedIcon}
      {...rest}
    />
  );
};
