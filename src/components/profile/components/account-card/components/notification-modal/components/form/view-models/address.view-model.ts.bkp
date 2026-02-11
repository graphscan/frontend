import { makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";

export type AddressViewModelConstructorArgs = {
  initialValue?: string;
  readOnly?: boolean;
};

export class AddressViewModel {
  readonly id = nanoid();
  readonly initialValue: string = "";
  value = "";
  error: string | undefined = undefined;
  readOnly = false;

  constructor(options?: { initialValue?: string }) {
    makeAutoObservable(
      this,
      {
        id: false,
        initialValue: false,
      },
      { autoBind: true },
    );

    if (options) {
      const { initialValue } = options;
      if (initialValue) {
        this.value = initialValue;
        this.initialValue = initialValue;
      }
    }
  }

  get isValid() {
    return !this.isEmpty && !this.hasSpaces && this.isValidEvmAddress;
  }

  get payload() {
    return this.value;
  }

  private get isEmpty() {
    return this.value.length === 0;
  }

  private get isValidEvmAddress() {
    return /^0x[a-fA-F0-9]{40}$/.test(this.value);
  }

  private get hasSpaces() {
    return /\s/.test(this.value);
  }

  private get tooShort() {
    return this.value.length < 3;
  }

  setValue(address: string) {
    this.value = address;
    this.validate();
  }

  private validate() {
    if (this.isEmpty) {
      this.error = "Required field to fill in";
    } else if (this.hasSpaces) {
      this.error = "This value must not contain spaces";
    } else if (this.tooShort) {
      this.error = "This value must be at least 3 characters long";
    } else if (!this.isValidEvmAddress) {
      this.error = "Invalid address";
    } else {
      this.error = undefined;
    }
  }
}
