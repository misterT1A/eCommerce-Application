import type BaseComponent from '../utils/base-component';

export default abstract class Controller<T extends BaseComponent> {
  protected view: BaseComponent;

  constructor(view: T) {
    this.view = view;
  }

  public get getView() {
    return this.view;
  }

  public showContent(parent: BaseComponent) {
    parent.appendChildren([this.view]);
  }
}
