import { makeAutoObservable } from "mobx";

export class NumberViewModel {
  readonly id: string;
  readonly label: string;
  readonly initialValue: string = "";
  error: string | undefined = undefined;
  value = "";
  readOnly = false;

  constructor(id: string, label: string, options?: { initialValue?: string }) {
    makeAutoObservable(this, { id: false, label: false }, { autoBind: true });
    this.id = id;
    this.label = label;

    if (options) {
      const { initialValue } = options;
      if (initialValue) {
        this.value = initialValue;
        this.initialValue = initialValue;
      }
    }
  }

  get isValid() {
    return !this.isEmpty && this.isNumber;
  }

  get payload() {
    return Number(this.value);
  }

  private get isEmpty() {
    return this.value.length === 0;
  }

  private get isNumber() {
    return isFinite(Number(this.value));
  }

  setValue(value: string) {
    this.value = value;
    this.validateValue();
  }

  private validateValue() {
    if (this.isEmpty) {
      this.error = "Required field to fill in";
    } else if (!this.isNumber) {
      this.error = "This value must be a number";
    } else {
      this.error = undefined;
    }
  }
}
