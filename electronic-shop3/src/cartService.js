// cartService.js
import axios from 'axios';
import { getUserId } from './components/pages/Account/userStorageService';
const BASIC_URL = 'http://localhost:8080/';

export const addToCart = async (productId) => {
  const cartItem = {
    productId: productId,
    userId: getUserId(),
  };
  console.log(cartItem);

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
      // Si la réponse n'est pas "ok", on jette une erreur avec le statut de la réponse
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    // Déclencher l'événement personnalisé "cartUpdated"
    const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: { cartCount: await getCartItemCount() } });
    window.dispatchEvent(cartUpdatedEvent);

    return response;
  } catch (error) {
    console.error('There was an error adding the item to the cart:', error);
    return { ok: false, status: error.status, error: error.message }; // On retourne un objet avec l'erreur pour la gestion ultérieure
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`${BASIC_URL}api/customer/cart/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch cart items:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

export const getCartItemCount = async () => {
  const userId = getUserId();
  try {
    const response = await axios.get(`${BASIC_URL}api/customer/cart/${userId}`);
    if (response.status === 200 && response.data.cartItems) {
      return response.data.cartItems.length;
    } else {
      console.error('Failed to fetch cart item count:', response.status);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching cart item count:', error);
    return 0;
  }
};
