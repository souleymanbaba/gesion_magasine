import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../pages/Account/userStorageService'; // Ensure the function is imported correctly
import '../../style.css';

const ProductCard = ({ deal, updateCart }) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleAddToCart = () => {
    if (user) {
      console.log("User is logged in. Adding to cart:", deal);
      // If the user is logged in, add the item to the cart
      updateCart(deal);
    } else {
      console.log("User is not logged in. Redirecting to login page.");
      // If the user is not logged in, redirect to the login page with a message
      navigate('/login', { state: { message: 'Please log in to add items to your cart' } });
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
