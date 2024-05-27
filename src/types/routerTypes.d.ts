interface IRoute {
  path: string;
  callBack: (() => void) | ((name: string) => void);
}

interface IController extends Controller<BaseComponent> {
  get getView(): BaseComponent;
  showContent(parent: BaseComponent): void;
}
