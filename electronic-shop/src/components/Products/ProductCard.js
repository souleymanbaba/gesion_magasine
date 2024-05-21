import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../pages/Account/userStorageService'; // Assurez-vous que la fonction est correctement importée
import '../../style.css';
import { addToCart } from '../../cartService';
import Swal from 'sweetalert2';

const ProductCard = ({ deal, updateCart }) => {
  const navigate = useNavigate();
  const user = getUser();


  const handleAddToCart = async () => {


    
    if (user) {


      try {
        const response = await addToCart(deal.id);// Assuming addToCart is defined elsewhere
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
          text: 'il est deja dans votre panier : ' ,
        });
      }
      console.log("User is logged in. Adding to cart:", deal);
      // Si l'utilisateur est connecté, ajoutez l'article au panier
      updateCart(deal);
    } else {
      console.log("User is not logged in. Redirecting to login page.");
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion avec un message
      navigate('/SigIn', { state: { message: 'Please log in to add items to your cart' } });
    }
  };

  return (
    <article className="fl w-100 w-50-m w-25-ns pa2-ns">
      <h3 className="f2">{deal.name}</h3>
      <div className="db bc-center w-100 h-200 br2 br--top">
        <img src={`data:image/png;base64,${deal.byteimg}`} height="350" width="250" alt={deal.name} className="" />
      </div>
      <h2 className="f3 tl">
        Original Price: <span style={{ color: "#820001", fontWeight: "bolder" }}>{deal.price.toFixed(2)}/-</span>
      </h2>
      <div className="ph2 ph0-ns pb3 pa1 db">
        <button
          className="ant-btn ant-btn-primary"
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
