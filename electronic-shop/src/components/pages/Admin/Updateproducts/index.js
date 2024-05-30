import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Style.css';

function ProductUpdateForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    categoryName: '',
    taille: '',
    marque: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/product/${productId}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch product');
        }
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('description', product.description);
      formData.append('categoryId', product.categoryId);
      formData.append('categoryName', product.categoryName);
      formData.append('taille', product.taille);
      formData.append('marque', product.marque);
      if (image) {
        formData.append('img', image);
      }

      const response = await axios.put(`http://localhost:8080/api/admin/product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Updated product:', response.data);
      setSuccessMessage('Product updated successfully');
      setShowMessage(true);
    } catch (error) {
      setError(error.message);
      setShowMessage(true);
    }
  };

  const handleCloseMessage = () => {
    navigate('/admin/ProductsA'); // redirection vers la page des produits
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h1 className="mb-4">Mettre à jour le produit</h1>
          <Alert
            variant={error ? 'danger' : 'success'}
            show={showMessage}
            onClose={handleCloseMessage}
            dismissible
          >
            {error ? error : successMessage}
            <Button variant="primary" onClick={handleCloseMessage} className="ms-2">
              Fermer
            </Button>
          </Alert>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nom"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Prix</label>
              <input
                type="number"
                className="form-control"
                placeholder="Prix"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">ID de catégorie</label>
              <input
                type="text"
                className="form-control"
                placeholder="ID de catégorie"
                value={product.categoryId}
                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nom de la catégorie</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nom de la catégorie"
                value={product.categoryName}
                onChange={(e) => setProduct({ ...product, categoryName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Taille</label>
              <input
                type="text"
                className="form-control"
                placeholder="Taille"
                value={product.taille}
                onChange={(e) => setProduct({ ...product, taille: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Marque</label>
              <input
                type="text"
                className="form-control"
                placeholder="Marque"
                value={product.marque}
                onChange={(e) => setProduct({ ...product, marque: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input type="file" className="form-control" onChange={handleImageChange} />
            </div>
            <Button variant="primary" type="submit">Mettre à jour le produit</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdateForm;
