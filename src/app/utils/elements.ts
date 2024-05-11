import type { Props } from './base-component';
import BaseComponent from './base-component';

export const div = (classList: string[], ...children: BaseComponent[]): BaseComponent => {
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

export const label = (classList: string[], text: string, ...children: BaseComponent[]) => {
  const labelComponent = new BaseComponent<HTMLLabelElement>({ tag: 'label' });
  labelComponent.setTextContent(text);
  labelComponent.addClass(...classList);
  labelComponent.appendChildren(children);
  return labelComponent;
};

export const span = (classList: string[], text: string, ...children: BaseComponent[]) => {
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

export const li = (classList: string[], ...children: BaseComponent[]) => {
  const liComponent = new BaseComponent<HTMLLIElement>({ tag: 'li' });
  liComponent.appendChildren(children);
  liComponent.addClass(...classList);
  return liComponent;
};
