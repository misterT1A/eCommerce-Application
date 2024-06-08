import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import AuthService from './auth-service';

class CartApiService {
  private root: ByProjectKeyRequestBuilder;

  constructor() {
    this.root = AuthService.getRoot();
  }

  public async createCart() {
    try {
      this.root
        .carts()
        .post({ body: { currency: 'EUR' } })
        .execute()
        .then((response) => {
          console.log('Корзина успешно создана:', response.body);
        })
        .catch((error) => {
          console.error('Ошибка при создании корзины:', error);
        });
    } catch {
      //
    }
  }
}

const CartService = new CartApiService();
export default CartService;
