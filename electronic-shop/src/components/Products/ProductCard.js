import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../pages/Account/userStorageService'; // Ensure the function is correctly imported
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { addToCart } from '../../cartService';
import Swal from 'sweetalert2';

const ProductCard = ({ deal, updateCart }) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleAddToCart = async () => {
    if (user) {
      try {
        const response = await addToCart(deal.id); // Assuming addToCart is defined elsewhere
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Produit ajouté',
            text: 'Le produit a été ajouté à votre panier avec succès!',
          });
          updateCart(deal);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Il y a eu un problème lors de l\'ajout du produit à votre panier.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'il est déjà dans votre panier : ',
        });
      }
      console.log("User is logged in. Adding to cart:", deal);
    } else {
      console.log("User is not logged in. Redirecting to login page.");
      navigate('/SigIn', { state: { message: 'Please log in to add items to your cart' } });
    }
  };

  return (
    <div className="card product-card mb-4 shadow-sm">
      <h5 className="card-header text-center">{deal.name}</h5>
      <div className="card-body text-center">
        <img 
          src={`data:image/png;base64,${deal.byteimg}`} 
          alt={deal.name} 
          className="card-img-top img-fluid product-image" 
        />
        <h5 className="card-title mt-3">
          <FontAwesomeIcon icon={faDollarSign} /> {deal.price.toFixed(2)} /-
        </h5>
        <button
          className="btn btn-primary mt-3"
          style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: '1.2rem', height: '50px' }}
          onClick={handleAddToCart}
        >
          <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
