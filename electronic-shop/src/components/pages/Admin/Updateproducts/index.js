import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false); // état pour gérer l'affichage du message

  // Fonction pour récupérer les informations du produit
  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Fonction pour mettre à jour le produit
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      // Affichage d'un message de succès
      setSuccessMessage('Product updated successfully');
      setShowMessage(true); // afficher le message
    } catch (error) {
      // En cas d'erreur, affichage du message d'erreur
      setError(error.message);
      setShowMessage(true); // afficher le message
    }
  };

  const handleCloseMessage = () => {
    navigate('/admin/ProductsA'); // redirection vers la page des produits
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 className="my-4">Update Product</h1>
      <Alert variant={error ? 'danger' : 'success'} show={showMessage} onClose={() => setShowMessage(false)} dismissible>
        {error ? error : successMessage}
        <Button variant="primary" onClick={handleCloseMessage} className="ms-2">
          Close
        </Button>
      </Alert>
      <Form onSubmit={handleUpdateProduct}>
        <Form.Group controlId="productName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="productDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="productPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="productCategoryId">
          <Form.Label>Category ID</Form.Label>
          <Form.Control
            type="number"
            value={product.category_id}
            onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Update
        </Button>
      </Form>
    </div>
  );
};

export default UpdateProduct;
