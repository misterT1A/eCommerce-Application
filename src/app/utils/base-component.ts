export type Props<T extends HTMLElement = HTMLElement> = Partial<T> & {
  tag?: keyof HTMLElementTagNameMap;
  data?: DOMStringMap;
};

type ListenerType = (e: Event) => void;

type ChildType = BaseComponent | HTMLElement | SVGSVGElement | null;

export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected listeners: Record<string, ListenerType[]> = {};

  protected children: BaseComponent[] = [];

  constructor(props: Props<T>, ...children: ChildType[]) {
    const node = document.createElement(props.tag ?? 'div') as T;
    Object.assign(node, props);

    if (props.data) {
      Object.entries(props.data).forEach(([name, value]) => {
        node.dataset[name] = value;
      });
    }

    this.node = node;

    if (children) {
      this.appendChildren(children);
    }
  }

  public append(child: ChildType): void {
    if (!child) {
      return;
    }
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: ChildType[]): void {
    children.forEach((el) => {
      if (el) {
        this.append(el);
      }
    });
  }

  public setTextContent(text: string): void {
    this.node.textContent = text;
  }

  public getNode() {
    return this.node;
  }

  public get getBaseComponent() {
    return this;
  }

  public get getChildren() {
    return this.children;
  }

  public addClass(...classNames: string[]): void {
    [...classNames].forEach((className) => this.node.classList.add(className));
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public addListener(event: string, listener: ListenerType): void {
    this.node.addEventListener(event, listener);
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  public removeListeners(): void {
    Object.entries(this.listeners).forEach(([event, listeners]) => {
      listeners.forEach((listener) => this.node.removeEventListener(event, listener));
    });
  }

  public destroyChildren(): void {
    this.children.forEach((child) => {
      child.destroy();
    });
    this.children = [];
  }

  public destroy(): void {
    this.destroyChildren();
    this.removeListeners();
    this.node.remove();
  }
}
