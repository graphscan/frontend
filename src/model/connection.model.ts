import { makeAutoObservable } from "mobx";

const CURRENT_ADDRESS_STORAGE_KEY = "current-address";

class ConnectionViewModel {
  currentAddress =
    typeof localStorage !== "undefined"
      ? localStorage.getItem(CURRENT_ADDRESS_STORAGE_KEY)
      : null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setCurrentAddress(currentAddress: string | null) {
    this.currentAddress = currentAddress;

    if (typeof currentAddress === "string") {
      localStorage.setItem(CURRENT_ADDRESS_STORAGE_KEY, currentAddress);
    } else {
      localStorage.removeItem(CURRENT_ADDRESS_STORAGE_KEY);
    }
  }
}

export const connectionViewModel = new ConnectionViewModel();
