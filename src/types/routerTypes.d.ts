interface IRoute {
  path: string;
  callBack: () => void;
}

interface IController extends Controller<BaseComponent> {
  get getView(): BaseComponent;
  showContent(parent: BaseComponent): void;
}
