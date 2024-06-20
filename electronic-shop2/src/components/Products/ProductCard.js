import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../pages/Account/userStorageService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './productStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDollarSign, faCheckCircle, faHeart } from '@fortawesome/free-solid-svg-icons';
import { addToCart, getCartItems } from '../../cartService';
import { addToWishlist } from '../../wishlistService';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ deal, updateCart }) => {
  const { t, i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');
  const navigate = useNavigate();
  const user = getUser();
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }

    const checkProductInCart = async () => {
      if (user) {
        try {
          const cartItems = await getCartItems(user.userId);
          console.log('Cart items:', cartItems); // Ligne de débogage

          if (Array.isArray(cartItems)) {
            const isProductInCart = cartItems.some(item => item.productId === deal.id);
            console.log('Is product in cart:', isProductInCart); // Ligne de débogage
            setAddedToCart(isProductInCart);
            if (isProductInCart) {
              localStorage.setItem(`product_${deal.id}_in_cart`, JSON.stringify(true));
            }
          } else {
            console.error('Cart items is not an array:', cartItems);
          }
        } catch (error) {
          console.error('Error checking cart items:', error);
        }
      }
    };

    checkProductInCart();
  }, [i18n.language, deal.id, user]);

  const handleAddToCart = async () => {
    if (user) {
      const response = await addToCart(deal.id);
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: t('added_to_cart'),
          text: t('added_successfully'),
        });
        updateCart();
        setAddedToCart(true);
        localStorage.setItem(`product_${deal.id}_in_cart`, JSON.stringify(true));
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: t('error_title'),
          text: i18n.language === 'fr' ? 'Produit déjà dans le panier' : 'المنتج موجود بالفعل في السلة',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('error_title'),
          text: response.error || t('error_message'),
        });
      }
    } else {
      navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    }
  };

  const handleAddToWishlist = async () => {
    if (user) {
      try {
        const response = await addToWishlist(deal.id);
        Swal.fire({
          icon: 'success',
          text: t('added_to_wishlist_message'),
        });
        setAddedToWishlist(true);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          text: t('error_message'),
        });
        console.error('Error adding to wishlist:', error);
      }
    } else {
      navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    }
  };
  return (
    <div className="card product-card mb-4 shadow-sm" style={{ direction: direction }}>
      <h5 className="card-header text-center">{deal.name}</h5>
      <div className="card-body text-center">
        <img 
          src={`data:image/png;base64,${deal.byteimg}`} 
          alt={deal.name} 
          className="card-img-top img-fluid product-image"
          style={{ direction: direction === 'rtl' ? 'rtl' : 'ltr', width: '70%', height: 'auto', maxHeight: '150px' }} 
        />
        <h5 className="card-title mt-3">
          <FontAwesomeIcon icon={faDollarSign} /> {deal.price.toFixed(2)} /-
        </h5>
        {addedToCart ? (
          <div className="text-success mb-2">
            <FontAwesomeIcon icon={faCheckCircle} /> {i18n.language === 'fr' ? 'Produit déjà dans le panier' : 'المنتج موجود بالفعل في السلة'}
          </div>
        ) : (
          <button
            className="btn btn-primary mt-3 me-3"
            style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: '1.2rem', height: '50px' }}
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        )}
        {addedToWishlist ? (
          <div className="text-danger mb-2">
            <FontAwesomeIcon icon={faCheckCircle} /> 
          </div>
        ) : (
          <button
            className="btn btn-danger mt-3"
            style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: '1.2rem', height: '50px' }}
            onClick={handleAddToWishlist}
          >
            <FontAwesomeIcon icon={faHeart} /> 
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
