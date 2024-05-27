import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import './style.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
    <div className="admin-products mt-4"> {/* Ajout de la classe mt-4 pour une marge supérieure */}
      <h1 className="admin-products__title">Products</h1>
      <div className="admin-products__add-button mb-3">
        <Link to="/admin/products/new">
          <Button variant="success">
            <FaPlus className="add-button__icon" /> Add
          </Button>
        </Link>
      </div>
      <div className="admin-products__table mb-5">
        <Table striped bordered hover>
          <thead className="admin-products__table-header">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Marque</th>
              <th>Taille</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="admin-products__table-row">
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.categoryName}</td>
                <td>{product.marque}</td>
                <td>{product.taille}</td>
                <td className="admin-products__table-actions">
                  <Button variant="primary" onClick={() => handleViewImage(product)}>View</Button>
                  <Link to={`/admin/products/${product.id}/edit`} className="btn btn-warning">Update</Link>
                  <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? selectedProduct.name : 'Product Image'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <img 
              src={`data:image/png;base64,${selectedProduct.byteimg}`} 
              alt={selectedProduct.name} 
              className="admin-products__modal-image" 
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;
