import type { Props } from './base-component';
import BaseComponent from './base-component';

type ChildType = BaseComponent | HTMLElement | SVGSVGElement | null;

export const div = (classList: string[], ...children: ChildType[]): BaseComponent => {
  const divComponent = new BaseComponent({ tag: 'div' }, ...children);
  divComponent.addClass(...classList);
  return divComponent;
};

export const h1 = (classList: string[], text: string) => {
  const hComponent = new BaseComponent<HTMLHeadingElement>({ tag: 'h1' });
  hComponent.addClass(...classList);
  hComponent.setTextContent(text);
  return hComponent;
};

export const h2 = (classList: string[], text: string) => {
  const hComponent = new BaseComponent<HTMLHeadingElement>({ tag: 'h2' });
  hComponent.addClass(...classList);
  hComponent.setTextContent(text);
  return hComponent;
};

export const p = (classList: string[], text: string) => {
  const pComponent = new BaseComponent<HTMLElement>({ tag: 'p' });
  pComponent.addClass(...classList);
  pComponent.setTextContent(text);
  return pComponent;
};

export const button = (classList: string[], text: string, props: Props<HTMLButtonElement> = {}) => {
  const buttonComponent = new BaseComponent<HTMLButtonElement>({ tag: 'button', ...props });
  buttonComponent.addClass(...classList);
  buttonComponent.setTextContent(text);
  return buttonComponent;
};

export const input = (classList: string[], props: Props<HTMLInputElement> = {}) => {
  const inputComponent = new BaseComponent<HTMLInputElement>({ tag: 'input', ...props });
  inputComponent.addClass(...classList);
  return inputComponent;
};

export const label = (classList: string[], text: string, ...children: ChildType[]) => {
  const labelComponent = new BaseComponent<HTMLLabelElement>({ tag: 'label' });
  labelComponent.setTextContent(text);
  labelComponent.addClass(...classList);
  labelComponent.appendChildren(children);
  return labelComponent;
};

export const span = (classList: string[], text: string, ...children: ChildType[]) => {
  const spanComponent = new BaseComponent<HTMLSpanElement>({ tag: 'span' }, ...children);
  spanComponent.setTextContent(text);
  spanComponent.addClass(...classList);
  return spanComponent;
};

export const ul = (classList: string[], ...children: BaseComponent<HTMLLIElement>[]) => {
  const ulComponent = new BaseComponent<HTMLUListElement>({ tag: 'ul' }, ...children);
  ulComponent.addClass(...classList);
  return ulComponent;
};

export const li = (classList: string[], ...children: ChildType[]) => {
  const liComponent = new BaseComponent<HTMLLIElement>({ tag: 'li' });
  liComponent.appendChildren(children);
  liComponent.addClass(...classList);
  return liComponent;
};

/**
 * Creates an SVG element with the specified URL and class name.
 * @param {string} url - The URL of the SVG file (relative path from index.html in /dist folder to .svg file + #id-of-svg-element
 *
 * To use add in your svg file, <svg id="id-of-svg-element" ...
 *
 * @example  // in component.ts
 * const url = "./assets/img/icon.svg#some-id";
 * const mySvg = svg(url, "some-class-1");
 * mySvg.onclick = () => mySvg.classList.toggle('some-class-2');
 * // in icon.svg
 * <svg id="some-id" ...
 * // svg can be appended in BaseComponent wrapper:
 * const div = new BaseComponent({tag: "div"}, mySvg);
 * @param {string} classname - The class name to add to the SVG element.
 * @returns {SVGSVGElement} - The SVG element.
 */
export const svg = (url: string, className?: string): SVGSVGElement => {
  const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (className) {
    svgContainer.classList.add(className);
  }
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', url);
  svgContainer.append(use);
  return svgContainer;
};

export const a = (
  classList: string[],
  props: { href?: string; text?: string; isExternal?: boolean; icon?: SVGSVGElement; navigate?: () => void }
) => {
  const anchorComponent = new BaseComponent<HTMLAnchorElement>({
    tag: 'a',
    href: props.href,
    target: props.isExternal ? '_blanc' : '_self',
  });
  if (props.text) {
    anchorComponent.setTextContent(props.text);
  }
  if (!props.isExternal) {
    anchorComponent.addListener('click', (e) => {
      e.preventDefault();
      if (props.navigate) {
        props.navigate();
      }
    });
  }
  if (props.icon) {
    anchorComponent.append(props.icon);
  }
  anchorComponent.addClass(...classList);
  return anchorComponent;
};
