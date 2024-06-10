import { getUserId } from './components/pages/Account/userStorageService';

const BASIC_URL = 'http://localhost:8080/';

export const addToWishlist = async (productId) => {
  const cartItem = {
    productId: productId,
    userId: getUserId(),
  };
  console.log(cartItem)

  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${BASIC_URL}api/customer/wishlist`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(cartItem),
      
    });

    if (!response.ok) {
      throw new Error('Failed to add to wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};











// // wishlistService.js

// import axios from 'axios';

// // Cette fonction ajoute un produit à la liste de souhaits
// export const addToWishlist = async (productId) => {
//   try {
//     const response = await axios.post('http://localhost:8080/api/customer/wishlist', { productId });
//     console.log(`Product ${productId} added to wishlist`);
//     return response.data; // Retourne les données de la réponse de l'API
//   } catch (error) {
//     console.error('Error adding to wishlist:', error);
//     throw error; // Lance une erreur pour gérer le cas d'échec de la requête
//   }
// };
