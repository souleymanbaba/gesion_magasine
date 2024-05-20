import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Make sure to adjust the path according to your file structure
import '../../style.css'


function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(' http://localhost:8080/api/admin/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  const updateCart = (productId) => {
    // Handle adding product to cart
    console.log(`Adding product ${productId} to cart`);
  };

  return (
    <div className="container" id="product-cards">
      <h1 className="text-center">PRODUCTS</h1>
      <div className="row" style={{ marginTop: '30px' }}>
        {products.map(product => (
          <div className="col-md-3 py-3 py-md-0" key={product.id}>
            <ProductCard deal={product} updateCart={() => updateCart(product.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
