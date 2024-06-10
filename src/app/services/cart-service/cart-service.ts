// import type { Cart } from '@commercetools/platform-sdk';

import type { ClientResponse, Customer } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';
import MyCustomer from '@services/customer-service/myCustomer';

import CurrentCart from './currentCart';

class CartApiService {
  constructor() {
    CurrentCart.setCart(JSON.parse(localStorage.getItem('cartNetN') as string) || null);
  }

  public async createNewCustomerCart(ID: Customer['id']) {
    await AuthService.getRoot()
      .carts()
      .post({ body: { currency: 'EUR', customerId: ID } })
      .execute()
      .then((response) => {
        CurrentCart.setCart(response.body);
        console.log('Корзина успешно создана:', CurrentCart.getCart);
      })
      .catch((error) => {
        console.error('Ошибка при создании корзины:', error);
      });
  }

  public async createAnonymousCart() {
    await AuthService.getRoot()
      .carts()
      .post({ body: { currency: 'EUR' } })
      .execute()
      .then((response) => {
        CurrentCart.setCart(response.body);
        console.log('Анонимная корзина успешно создана:', CurrentCart.getCart);
      })
      .catch((error) => {
        console.error('Ошибка при создании анонимной корзины:', error);
      });
  }

  public async addToCart(productId: string) {
    if (!CurrentCart.isCart()) {
      await this.createAnonymousCart();
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
        console.log('Товар добавлен в корзину, всего товаров в корзине:', CurrentCart.totalQuantity);
      })
      .catch((error) => {
        console.error('Ошибка при добавлении товара в корзину:', error);
      });
  }

  public getCustomerCart(): Promise<ClientResponse> | undefined {
    if (!AuthService.isAuthorized()) {
      return undefined;
    }
    return AuthService.getRoot()
      .carts()
      .withCustomerId({ customerId: MyCustomer.id as string })
      .get()
      .execute();
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
