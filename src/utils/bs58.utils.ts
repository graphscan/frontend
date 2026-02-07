import bs58 from "bs58";

export const bs58encode = (input: string) =>
  bs58.encode(Buffer.from(input, "hex"));
