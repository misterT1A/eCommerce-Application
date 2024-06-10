import type { Cart, CartUpdateAction } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';
import { processErrorResponse, showErrorMessages } from '@utils/errors-handling';

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
      .withId({ ID: CurrentCart.id ?? '' })
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

  public async changeCart(actions: CartUpdateAction[]) {
    if (!CurrentCart.isCart()) {
      await this.createCart();
    }
    try {
      const changeCartResp = await AuthService.getRoot()
        .carts()
        .withId({ ID: CurrentCart.id ?? '' })
        .post({
          body: {
            version: CurrentCart.version,
            actions,
          },
        })
        .execute();
      CurrentCart.setCart(changeCartResp.body);
      return {
        success: true,
        actions,
      };
    } catch (error) {
      const errorsResponse = processErrorResponse(error);
      showErrorMessages(errorsResponse);
      return {
        success: false,
      };
    }
  }

  public async updateCart(ID: Cart['id']) {
    try {
      const response = await AuthService.getRoot().carts().withId({ ID }).get().execute();
      console.log('Корзина успешно обновлена:', CurrentCart.getCart);
      CurrentCart.setCart(response.body);
    } catch (error) {
      const errorsResponse = processErrorResponse(error);
      showErrorMessages(errorsResponse);
      console.error('Ошибка при обновлении корзины:', error);
    }
  }

  // public getCart(ID: Cart['id']) {
  //   return AuthService.getRoot().carts().withId({ ID }).get().execute();
  // }
}

const CartService = new CartApiService();
export default CartService;
