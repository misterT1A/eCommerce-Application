import type { Cart, CartUpdateAction, Customer } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';
import MyCustomer from '@services/customer-service/myCustomer';
import { processErrorResponse, showErrorMessages } from '@utils/errors-handling';

import CurrentCart from './currentCart';

class CartApiService {
  public apiDiscountCodes: { [id: string]: string }[] = [];

  constructor() {
    CurrentCart.setCart(JSON.parse(localStorage.getItem('cartNetN') as string) || null);
    this.getDiscountCodes();
  }

  public async createNewCustomerCart(ID: Customer['id']) {
    try {
      const cartCreateResp = await AuthService.getRoot()
        .carts()
        .post({ body: { currency: 'EUR', customerId: ID } })
        .execute();
      return {
        cartID: cartCreateResp.body.id,
      };
    } catch (error) {
      const errorsResponse = processErrorResponse(error);
      showErrorMessages(errorsResponse);
      console.error('Ошибка при создании корзины:', error);
      return {
        cartID: '',
      };
    }
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

  public async changeCartEntries(actions: CartUpdateAction[]) {
    if (!CurrentCart.isCart()) {
      if (!AuthService.isAuthorized()) {
        await this.createAnonymousCart();
      } else {
        await this.createNewCustomerCart(MyCustomer.id ?? '');
      }
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
      CurrentCart.setCart(response.body);
    } catch (error) {
      const errorsResponse = processErrorResponse(error);
      showErrorMessages(errorsResponse);
      // console.error('Ошибка при обновлении корзины:', error);
    }
  }

  private async getDiscountCodes() {
    try {
      const response = await AuthService.getRoot().discountCodes().get().execute();
      const discountCodes = response.body.results;
      discountCodes.forEach((code) => this.apiDiscountCodes.push({ [code.id]: code.code }));
    } catch (error) {
      const errorsResponse = processErrorResponse(error);
      showErrorMessages(errorsResponse);
    }
  }

  public getDiscountCodeNameById(id: string) {
    const codeObj = this.apiDiscountCodes.find((obj) => Object.keys(obj).includes(id));
    return codeObj ? codeObj[id] : '';
  }

  public isDOUBLECodeApplied() {
    return !!CurrentCart.discountCodes?.some((code) => code.discountCode.id === '9a535f60-d16c-4abc-9e7a-a22e3929e537');
  }

  public isClassicCroissantInCart() {
    return !!CurrentCart.products.some((product) => product.productKey === 'classic-croissant' && product.quantity > 1);
  }
}

const CartService = new CartApiService();
export default CartService;
