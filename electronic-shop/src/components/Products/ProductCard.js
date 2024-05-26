import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../pages/Account/userStorageService'; // Ensure the function is correctly imported
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style.css';
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
      updateCart(deal);
    } else {
      console.log("User is not logged in. Redirecting to login page.");
      navigate('/SigIn', { state: { message: 'Please log in to add items to your cart' } });
    }
  };

  return (
    <article className="card mb-4">
      <h3 className="card-header">{deal.name}</h3>
      <div className="card-body">
        <img src={`data:image/png;base64,${deal.byteimg}`} height="200" width="100%" alt={deal.name} className="card-img-top" />
        <h4 className="card-title">
          Original Price: <span style={{ color: "#820001", fontWeight: "bolder" }}>{deal.price.toFixed(2)}/-</span>
        </h4>
        <button
          className="btn btn-primary"
          style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: 20, height: 50 }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
