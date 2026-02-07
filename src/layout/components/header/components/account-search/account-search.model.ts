export type Account = {
  id: string;
  defaultDisplayName: string | null;
  tokenLockWallets: Array<{ id: string }>;
};
