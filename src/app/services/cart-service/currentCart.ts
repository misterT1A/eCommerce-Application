import type { Cart, LineItem } from '@commercetools/platform-sdk';

class CurrentCart {
  private static cart: Cart | null = null;

  public static setCart(cart: Cart | null) {
    if (cart) {
      this.cart = cart;
      localStorage.setItem('cartNetN', JSON.stringify(cart));
    }
    // console.log('CurrentCart store:', this.cart);
  }

  public static isCart() {
    return !!this.cart;
  }

  public static deleteCart() {
    this.cart = null;
    localStorage.removeItem('cartNetN');
  }

  public static get version() {
    return this.cart?.version || 1;
  }

  public static get getCart() {
    return this.cart;
  }

  public static get id() {
    return this.cart?.id;
  }

  public static get products(): LineItem[] {
    return this.cart?.lineItems ?? [];
  }

  public static getProductCount(productKey: string) {
    const { products } = this;
    if (products.length) {
      const selectedProduct = products.find((product) => product.key === productKey);
      return selectedProduct?.quantity ?? 0;
    }
    return 0;
  }

  public static getProductCountByID(productID: string) {
    const { products } = this;
    if (products.length) {
      const selectedProduct = products.find((product) => product.productId === productID);
      return selectedProduct?.quantity ?? 0;
    }
    return 0;
  }

  public static getLineItemIdByProductId(productID: string) {
    const { products } = this;
    if (products.length) {
      const selectedProduct = products.find((product) => product.productId === productID);
      return selectedProduct?.id ?? '';
    }
    return '';
  }

  public static get totalCount() {
    return this.cart?.totalLineItemQuantity ?? 0;
  }

  public static get discountCodes() {
    return this.cart?.discountCodes;
  }
}

export default CurrentCart;
