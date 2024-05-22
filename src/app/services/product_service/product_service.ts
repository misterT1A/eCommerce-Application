import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';

export default class ProductsService {
  protected root: ByProjectKeyRequestBuilder;

  constructor() {
    this.root = AuthService.getRoot();
  }

  public getProduct() {
    return this.root.products().get().execute();
  }
}
