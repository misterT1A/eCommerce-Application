import type { CartAddLineItemAction, CartUpdateAction } from '@commercetools/platform-sdk';

import CartService from './cart-service';
import CurrentCart from './currentCart';

export const getMessage = (action?: CartUpdateAction, productName?: string) => {
  if (!action || !productName) {
    return { title: '', text: '' };
  }
  const { quantity } = action as CartAddLineItemAction;

  const messages = {
    addLineItem: {
      title: 'Added to Cart!',
      text: `Added ${quantity}x ${productName} to your cart.`,
    },
    removeLineItem: {
      title: 'Removed from Cart!',
      text: `Removed ${quantity}x ${productName} from your cart.`,
    },
  };
  return messages[(action as CartAddLineItemAction).action] || { title: '', text: '' };
};

export const updateProductsInCart = async (...products: { productID: string; count: number }[]) => {
  // update cart
  const actions: CartUpdateAction[] = products.reduce((acc: CartUpdateAction[], product) => {
    const currentProductCount = CurrentCart.getProductCountByID(product.productID);
    const delta = product.count - currentProductCount;
    if (!delta) {
      return acc;
    }
    let actionDescription = {} as CartUpdateAction;
    if (delta < 0) {
      actionDescription = {
        action: 'removeLineItem',
        lineItemId: CurrentCart.getLineItemIdByProductId(product.productID),
        quantity: Math.abs(delta),
      };
    } else {
      actionDescription = {
        action: 'addLineItem',
        productId: product.productID,
        quantity: Math.abs(delta),
      };
    }
    acc.push(actionDescription);
    return acc;
  }, []);
  return CartService.changeCart(actions);
};

export const clearCart = async () => {
  // update cart
  const products = CurrentCart.products.map((lineItem) => ({ productID: lineItem.id, count: 0 }));
  await updateProductsInCart(...products);
};
