export type DelegationTransaction = "delegate" | "undelegate" | "withdraw";

export type DelegationTransactionWithUI = Exclude<
  DelegationTransaction,
  "withdraw"
>;

export type Status = "loading" | "done" | null;
