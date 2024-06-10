// import type { Cart } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';

import CurrentCart from './currentCart';

class CartApiService {
  constructor() {
    CurrentCart.setCart(JSON.parse(localStorage.getItem('cartNetN') as string) || null);
  }

  public async createCart() {
    await AuthService.getRoot()
      .carts()
      .post({ body: { currency: 'EUR' } })
      .execute()
      .then((response) => {
        CurrentCart.setCart(response.body);
        console.log('Корзина успешно создана:', CurrentCart.getCart);
      })
      .catch((error) => {
        console.error('Ошибка при создании корзины:', error);
      });
  }

  public async addToCart(productId: string) {
    if (!CurrentCart.isCart()) {
      await this.createCart();
    }

    AuthService.getRoot()
      .carts()
      .withId({ ID: CurrentCart.id as string })
      .post({
        body: {
          version: CurrentCart.version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              quantity: 1,
            },
          ],
        },
      })
      .execute()
      .then((response) => {
        CurrentCart.setCart(response.body);
        console.log('Товар добавлен в корзину', CurrentCart.getCart);
      })
      .catch((error) => {
        console.error('Ошибка при добавлении товара в корзину:', error);
      });
  }

  // public updateCart(ID: Cart['id']) {
  //   AuthService.getRoot()
  //     .carts()
  //     .withId({ ID })
  //     .get()
  //     .execute()
  //     .then((response) => {
  //       CurrentCart.setCart(response.body);
  //       console.log('Корзина успешно обновлена:', CurrentCart.getCart);
  //     })
  //     .catch((error) => {
  //       console.error('Ошибка при обновлении корзины:', error);
  //     });
  // }

  // public getCart(ID: Cart['id']) {
  //   return AuthService.getRoot().carts().withId({ ID }).get().execute();
  // }
}

const CartService = new CartApiService();
export default CartService;
