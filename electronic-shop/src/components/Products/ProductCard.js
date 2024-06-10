import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../pages/Account/userStorageService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './productStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDollarSign, faCheckCircle, faHeart } from '@fortawesome/free-solid-svg-icons'; // Importez l'icône faHeart pour la liste de souhaits
import { addToCart } from '../../cartService';
import { addToWishlist } from '../../wishlistService'; // Importer la fonction pour ajouter au witchlist
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ deal, updateCart }) => {
  const [t, i18n] = useTranslation();
  const [direction, setDirection] = useState('ltr');
  const navigate = useNavigate();
  const user = getUser();
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false); // État pour suivre si le produit a été ajouté à la liste de souhaits

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }, [i18n.language]);

  const handleAddToCart = async () => {
    if (user) {
      try {
        const response = await addToCart(deal.id);
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: t('added_to_cart'),
            text: t('added_successfully'),
          });
          updateCart(deal);
          setAddedToCart(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: t('error_title'),
            text: t('error_message'),
          });
        }
      } catch (success) {
        Swal.fire({
          icon: 'success',
          title: t('success_title'),
          text: t('added_successfully'),
        });
        setAddedToCart(true);
      }
      console.log("User is logged in. Adding to cart:", deal);
    } else {
      console.log("User is not logged in. Redirecting to login page.");
      navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    }
  };

  const handleAddToWishlist = async () => {
    if (user) {
      try {
        const response = await addToWishlist(deal.id); // Appel de la fonction pour ajouter au witchlist
        if (response.ok) {
          Swal.fire({
            icon: 'success',
           
            text: t('added_to_wishlist_message'),
          });
          setAddedToWishlist(true); // Mettre à jour l'état pour indiquer que le produit a été ajouté à la liste de souhaits
        } else {
          Swal.fire({
            icon: 'success',
           
            text: t('added_to_wishlist_message'),
          });
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    } else {
      console.log("User is not logged in. Redirecting to login page.");
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
          style={{ direction: direction === 'rtl' ? 'rtl' : 'ltr' }} 
        />
        <h5 className="card-title mt-3">
          <FontAwesomeIcon icon={faDollarSign} /> {deal.price.toFixed(2)} /-
        </h5>
        {addedToCart ? (
          <div className="text-success mb-2">
            <FontAwesomeIcon icon={faCheckCircle} /> {t('added_to_cart_success')}
          </div>
        ) : (
          <button
            className="btn btn-primary mt-3 me-3"
            style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: '1.2rem', height: '50px' }}
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon icon={faShoppingCart} /> {t('add_to_cart')}
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
