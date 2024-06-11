import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Modal, Form, Container } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash, FaLanguage } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTranslationForm, setShowTranslationForm] = useState(false);
  const [translations, setTranslations] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  const handleViewImage = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleTranslationClick = (product) => {
    setSelectedProduct(product);
    setShowTranslationForm(true);
  };

  const handleTranslationChange = (field, value) => {
    setTranslations({
      ...translations,
      [field]: value
    });
  };

  const handleTranslationSubmit = async () => {
    if (!selectedProduct) return;

    const productId = selectedProduct.id;
    const translationData = {
      name_ar: translations.name,
      marque_ar: translations.marque,
      description_ar: translations.description,
      taille_ar: translations.taille,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}/translation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit translation');
      }

      console.log('Translation submitted successfully');
      setShowTranslationForm(false);
      setSelectedProduct(null);
      setTranslations({});
      fetchProducts(); // Rafraîchir la liste des produits après la traduction
    } catch (error) {
      console.error('Error submitting translation:', error.message);
    }
  };

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h1 className="mb-4">Products</h1>
      <Link to="/admin/products/new" className="mb-3">
        <Button variant="success">
          <FaPlus className="mr-2" /> Add
        </Button>
      </Link>
      <Table striped bordered hover className="mb-5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Marque</th>
            <th>Taille</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.categoryName}</td>
              <td>{product.marque}</td>
              <td>{product.taille}</td>
              <td>
                <Button variant="primary" onClick={() => handleViewImage(product)}>
                  <FaEye />
                </Button>
                <Link to={`/admin/products/${product.id}/edit`} className="btn btn-warning ml-1">
                  <FaEdit />
                </Link>
                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)} className="ml-1">
                  <FaTrash />
                </Button>
                <Button variant="secondary" onClick={() => handleTranslationClick(product)} className="ml-1">
                  <FaLanguage />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? selectedProduct.name : 'Product Image'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <img 
              src={`data:image/png;base64,${selectedProduct.byteimg}`} 
              alt={selectedProduct.name} 
              className="img-fluid" 
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTranslationForm} onHide={() => setShowTranslationForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Translate Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter translated name"
                value={translations.name || ''}
                onChange={(e) => handleTranslationChange('name', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProductDescription" className="mt-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter translated description"
                value={translations.description || ''}
                onChange={(e) => handleTranslationChange('description', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProductMarque" className="mt-3">
              <Form.Label>Product Marque</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter translated marque"
                value={translations.marque || ''}
                onChange={(e) => handleTranslationChange('marque', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProductTaille" className="mt-3">
              <Form.Label>Product Taille</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter translated taille"
                value={translations.taille || ''}
                onChange={(e) => handleTranslationChange('taille', e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleTranslationSubmit}>
              Submit Translation
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminProducts;
