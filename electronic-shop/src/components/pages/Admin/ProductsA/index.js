import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fonction pour récupérer les produits depuis le backend
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

  // Fonction pour supprimer un produit
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      // Mettre à jour la liste des produits après la suppression
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  // Fonction pour ouvrir le modal avec les détails de l'image
  const handleViewImage = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container">
      <h1 className="my-4">Products</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/admin/products/new" className="mb-3">
          <Button variant="primary">
            <FaPlus className="me-2" /> Add 
          </Button> 
        </Link>
      </div>
      <div className="table-responsive-sm">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category ID</th> 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.categoryName }</td> 
                <td className="d-flex">
                  <Button variant="primary" className="me-2" onClick={() => handleViewImage(product)}>View</Button>
                  <Link to={`/admin/products/${product.id}/edit`} className="btn btn-warning me-2">Update</Link>
                  <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal pour afficher l'image */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? selectedProduct.name : 'Product Image'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <img src={`data:image/png;base64,${selectedProduct.byteimg}`} alt={selectedProduct.name} style={{ width: '100%' }} />
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
