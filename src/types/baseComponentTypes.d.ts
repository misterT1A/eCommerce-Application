/**
 * The properties to initialize the component with.
 */
type Props<T extends HTMLElement = HTMLElement> = Partial<T> & {
  tag?: keyof HTMLElementTagNameMap;
  data?: DOMStringMap;
};

/**
 * ListenerType represents the type of event listener functions.
 */
type ListenerType = (e: Event) => void;

/**
 * ChildType represents the types of children that can be appended to the component.
 */
type ChildType = IBaseComponent | HTMLElement | SVGSVGElement | null;

interface IBaseComponent<T extends HTMLElement = HTMLElement> {
  /**
   * Appends a child to the component.
   * @param {ChildType} child - The child to append.
   */
  append(child: ChildType): void;
  /**
   * Appends multiple children to the component.
   * @param {ChildType[]} children - The children to append.
   */
  appendChildren(children: ChildType[]): void;
  /**
   * Sets the text content of the component.
   * @param {string} text - The text content to set.
   */
  setTextContent(text: string): void;
  /**
   * Gets the HTML node of the component.
   * @returns {T} The HTML node.
   */
  getNode(): T;
  /**
   * Gets the base component instance.
   * @returns {IBaseComponent} The base component instance.
   */
  getBaseComponent: IBaseComponent;
  /**
   * Gets the children of the component.
   * @returns {IBaseComponent[]} The children.
   */
  getChildren: IBaseComponent[];
  /**
   * Adds one or more classes to the component.
   * @param {...string} classNames - The classes to add.
   */
  addClass(...classNames: string[]): void;
  /**
   * Removes a class from the component.
   * @param {string} className - The class to remove.
   */
  removeClass(className: string): void;
  /**
   * Adds an event listener to the component.
   * @param {string} event - The event to listen for.
   * @param {ListenerType} listener - The listener function.
   */
  addListener(event: string, listener: ListenerType): void;
  /**
   * Removes all event listeners from the component.
   */
  removeListeners(): void;
  /**
   * Destroys all children of the component.
   */
  destroyChildren(): void;
  /**
   * Destroys the component, removing all event listeners and children, and the component itself.
   */
  destroy(): void;
}

type RangeSelectorProps = {
  min: number;
  max: number;
  initialRange?: [number, number];
  name?: string;
  isInputInCents?: boolean;
  unit?: string;
};
