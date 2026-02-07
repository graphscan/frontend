import { makeAutoObservable } from "mobx";

class ConnectionViewModel {
  currentAddress: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setCurrentAddress(currentAddress: string | null) {
    this.currentAddress = currentAddress;
  }
}

export const connectionViewModel = new ConnectionViewModel();
