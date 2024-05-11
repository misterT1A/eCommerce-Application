import Controller from '@components/controller';
import type BaseComponent from '@utils/base-component';

import HeaderView from './view';

export default class HeaderController extends Controller<BaseComponent> {
  constructor() {
    super(new HeaderView());
  }
}
