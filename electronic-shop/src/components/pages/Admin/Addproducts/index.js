import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap';
import './style.css';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [productSize, setProductSize] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleProductPriceChange = (e) => setProductPrice(e.target.value);
  const handleProductDescriptionChange = (e) => setProductDescription(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleProductSizeChange = (e) => setProductSize(e.target.value);
  const handleProductBrandChange = (e) => setProductBrand(e.target.value);

  const handleProductImageChange = (e) => {
    const image = e.target.files[0];
    setProductImage(image);
    setPreviewImage(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('description', productDescription);
    formData.append('categoryId', selectedCategory);
    formData.append('taille', productSize);
    formData.append('marque', productBrand);
    if (productImage) {
      formData.append('img', productImage);
    }

    try {
      const response = await axios.post('http://localhost:8080/api/admin/product', formData);

      if (response.status >= 200 && response.status < 300) {
        setShowSuccessToast(true);
        // Réinitialiser les états après la soumission réussie
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setProductImage(null);
        setPreviewImage(null);
        setProductSize('');
        setProductBrand('');
        setSelectedCategory('');
        setErrorMessage('');
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage(error.message);
      setShowErrorToast(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="shadow p-4">
            <h2 className="text-center mb-4">Add Product</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name:</Form.Label>
                <Form.Control type="text" value={productName} onChange={handleProductNameChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Price:</Form.Label>
                <Form.Control type="number" value={productPrice} onChange={handleProductPriceChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Description:</Form.Label>
                <Form.Control as="textarea" rows={3} value={productDescription} onChange={handleProductDescriptionChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category:</Form.Label>
                <Form.Select value={selectedCategory} onChange={handleCategoryChange} required>
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Size:</Form.Label>
                <Form.Control type="text" value={productSize} onChange={handleProductSizeChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Brand:</Form.Label>
                <Form.Control type="text" value={productBrand} onChange={handleProductBrandChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Image:</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleProductImageChange} required />
              </Form.Group>
              {previewImage && (
                <div className="mb-3 text-center">
                  <Form.Label>Image Preview:</Form.Label>
                  <img src={previewImage} alt="Product Preview" className="img-fluid" />
                </div>
              )}
              <Button variant="primary" type="submit" className="w-100">Add Product</Button>
            </Form>
          </div>
        </Col>
      </Row>

      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2000 }}>
        <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
          <Toast.Body>Product added successfully!</Toast.Body>
        </Toast>

        <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide bg="danger" text="white">
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </div>
    </Container>
  );
};

export default AddProduct;
