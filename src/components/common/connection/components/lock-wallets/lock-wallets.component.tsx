import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Radio } from "./components/radio/radio.component";

type Props = {
  accountId: string;
  lockWallets: Array<string>;
  currentAddress: string | null;
  setCurrentAddress: (address: string | null) => void;
};

export const LockWallets: React.FC<Props> = ({
  accountId,
  lockWallets,
  currentAddress,
  setCurrentAddress,
}) => {
  const [currentChecked, setCurrentChecked] = useState(
    currentAddress ?? accountId,
  );

  useEffect(() => {
    setCurrentAddress(currentChecked);
  }, [currentChecked, setCurrentAddress]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCurrentChecked(e.target.value);
  }, []);

  return (
    <>
      <Radio
        id={accountId}
        label="Account"
        name="accounts"
        currentChecked={currentChecked}
        onChange={handleChange}
      />
      {lockWallets.map((id) => (
        <Radio
          label="Vesting contract"
          name="accounts"
          key={id}
          id={id}
          currentChecked={currentChecked}
          onChange={handleChange}
        />
      ))}
    </>
  );
};
