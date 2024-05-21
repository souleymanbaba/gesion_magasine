import { getUserId } from './components/pages/Account/userStorageService';

const BASIC_URL = 'http://localhost:8080/';

export const addToCart = async (productId) => {
  const cartItem = {
    productId: productId,
    userId: getUserId(),
  };
  console.log(cartItem)

  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${BASIC_URL}api/customer/cart`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(cartItem),
      
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};