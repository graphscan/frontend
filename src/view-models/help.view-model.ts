import { makeAutoObservable } from "mobx";

class HelpViewModel {
  isOpen = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen;
  }
}

export const helpViewModel = new HelpViewModel();
