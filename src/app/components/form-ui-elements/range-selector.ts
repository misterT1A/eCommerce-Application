import BaseComponent from '@utils/base-component';
import debounce from '@utils/debounce';
import { div, input, span } from '@utils/elements';

import styles from './_form-ui-elements.scss';

class RangeSelector extends BaseComponent {
  private leftBound: BaseComponent<HTMLElement>;

  private rightBound: BaseComponent<HTMLElement>;

  private inputMin: BaseComponent<HTMLInputElement>;

  public inputMax: BaseComponent<HTMLInputElement>;

  private label: BaseComponent<HTMLSpanElement>;

  private slider: BaseComponent<HTMLElement>;

  /**
 * Range selector. 
 * @param {RangeSelectorProps} params - Parameters for initializing the RangeSelector.
 * 
 * Fires 'input' and 'change' debounced events (delay = 500ms)  
 * 
 * @example 
 * const priceInput = new RangeSelector({
      min: 0,
      max:1000,
      isInputInCents: true,
      unit: '€',
      name: 'Price'
    });
    priceInput.setValue([5,700]);
    priceInput.getValue(); // [5,700]
 */
  constructor(private params: RangeSelectorProps) {
    super({ tag: 'div', className: styles.range });
    this.leftBound = div([styles.range__leftBound]);
    this.rightBound = div([styles.range__rightBound]);
    this.inputMin = input([styles.range__input], { type: 'range' });
    this.inputMax = input([styles.range__input], { type: 'range' });
    this.slider = div(
      [styles.range__rangeSlider],
      div([styles.range__rangeSliderBackgroundBar]),
      div([styles.range__rangeSliderBackground], this.leftBound, div([styles.range__rangeBar]), this.rightBound),
      div([styles.range__rangeInputs], this.inputMin, this.inputMax)
    );
    this.append(this.slider);
    this.label = span([styles.range__label], '');
    this.append(this.label);
    this.setListeners();
    if (!this.params.initialRange) {
      this.setValue([this.params.min, this.params.max]);
    } else {
      this.setValue(this.params.initialRange);
    }
  }

  private setListeners() {
    const debouncedInputEvent = debounce(() => {
      const inputEvent = new Event('input', { bubbles: true });
      this.getNode().dispatchEvent(inputEvent);
      const changeEvent = new Event('change', { bubbles: true });
      this.getNode().dispatchEvent(changeEvent);
    }, 300);
    this.inputMin.getNode().onchange = (e) => e.stopPropagation();
    this.inputMax.getNode().onchange = (e) => e.stopPropagation();
    this.inputMax.addListener('input', (e) => {
      e.stopPropagation();
      if (this.getMinValue() > this.getMaxValue() - 1) {
        this.inputMax.getNode().value = `${this.getMinValue() + 1}`;
      }
      this.redraw();
      debouncedInputEvent();
    });
    this.inputMin.addListener('input', (e) => {
      e.stopPropagation();
      if (this.getMinValue() > this.getMaxValue() - 1) {
        this.inputMin.getNode().value = `${this.getMaxValue() - 1}`;
      }
      this.redraw();
      debouncedInputEvent();
    });
    this.slider.addListener('click', (e) => {
      if (e instanceof PointerEvent) {
        this.handleSliderClick(e);
      }
    });
  }

  private handleSliderClick(e: PointerEvent) {
    const position =
      (100 * (e.clientX - this.getNode().getBoundingClientRect().left)) / this.getNode().getBoundingClientRect().width;
    const inputEvent = new Event('input', { bubbles: true });
    const distanceMin = Math.abs(position - this.getMinValue());
    const distanceMax = Math.abs(position - this.getMaxValue());
    if (distanceMin < distanceMax) {
      this.setMinValue(position);
      this.inputMin.getNode().dispatchEvent(inputEvent);
    } else {
      this.setMaxValue(position);
      this.inputMax.getNode().dispatchEvent(inputEvent);
    }
  }

  private redraw() {
    this.rightBound.getNode().style.width = `${100 - this.getMaxValue()}%`;
    this.leftBound.getNode().style.width = `${this.getMinValue()}%`;
    let [min, max]: (number | string)[] = this.getValue();
    if (this.params.isInputInCents) {
      min = (min / 100).toFixed(2);
      max = (max / 100).toFixed(2);
    } else {
      min = Number(min).toFixed(2);
      max = Number(max).toFixed(2);
    }
    this.label.setTextContent(
      `${this.params.name ?? ''}: ${this.params.unit ?? ''}${min} - ${this.params.unit ?? ''}${max}`
    );
  }

  private getMinValue() {
    return Number(this.inputMin.getNode().value);
  }

  private getMaxValue() {
    return Number(this.inputMax.getNode().value);
  }

  private setMinValue(value: number) {
    this.inputMin.getNode().value = `${value}`;
  }

  private setMaxValue(value: number) {
    this.inputMax.getNode().value = `${value}`;
  }

  private getNormalizedValue(value: number): number {
    const min = Math.min(this.params.min, this.params.max);
    const max = Math.max(this.params.min, this.params.max);
    return ((value - min) * 100) / (max - min);
  }

  private convertValue(value: number) {
    const min = Math.min(this.params.min, this.params.max);
    const max = Math.max(this.params.min, this.params.max);
    const normalizedValue = Math.round(((max - min) * value) / 100) + min;
    return normalizedValue;
  }

  /**
   * Gets the current range values.
   *
   * @returns {[number, number]} The current range values.
   */
  public getValue(): [number, number] {
    return [this.convertValue(this.getMinValue()), this.convertValue(this.getMaxValue())];
  }

  /**
   * Sets the range values.
   *
   * @param {[number, number]} range - The range values to set.
   */
  public setValue(range: [number, number]) {
    const min = this.getNormalizedValue(Math.min(...range));
    const max = this.getNormalizedValue(Math.max(...range));
    this.setMinValue(min);
    this.setMaxValue(max);
    this.redraw();
  }

  /**
   * Resets selected range
   *
   */
  public reset() {
    this.setValue([this.params.min, this.params.max]);
  }

  public updateRange(range: [number, number]) {
    const [min, max] = range;
    if (min > this.convertValue(this.getMinValue())) {
      this.setMinValue(0);
    }
    if (max < this.convertValue(this.getMaxValue())) {
      this.setMaxValue(100);
    }
    this.params.min = min;
    this.params.max = max;
    this.redraw();
  }
}

export default RangeSelector;
