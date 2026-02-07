import { Button } from "./transaction-button.styled";
import { To, From, Spinner, Success } from "./transaction-button.icons";
import { Status } from "../../../model/web3-transactions.model";
import { preventDefault } from "../../../utils/events.utils";
import { ReactNode } from "react";

type Props = {
  direction?: "from" | "to";
  disabled?: boolean;
  status?: Status;
  onClick?: () => void;
  children?: ReactNode;
};

export const TransactionButton: React.FC<Props> = ({
  direction,
  status = null,
  disabled = false,
  onClick = undefined,
  children,
}) => {
  const loading = status === "loading";
  const done = status === "done";

  return (
    <Button
      onMouseDown={preventDefault}
      onClick={onClick}
      isLoading={loading || undefined}
      disabled={disabled || loading}
    >
      {children}
      {done ? (
        <Success />
      ) : loading ? (
        <Spinner />
      ) : direction === "to" ? (
        <To />
      ) : direction === "from" ? (
        <From />
      ) : null}
    </Button>
  );
};
