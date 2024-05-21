import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Container, Row, Col, Form, Button, Card, Toast, ToastContainer } from 'react-bootstrap';
import './style.css';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleProductPriceChange = (e) => setProductPrice(e.target.value);
  const handleProductDescriptionChange = (e) => setProductDescription(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

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
    if (productImage) {
      formData.append('img', productImage);
    }

    try {
      const response = await axios.post('http://localhost:8080/api/admin/product', formData);

      if (response.status >= 200 && response.status < 300) {
        setShowSuccessToast(true);
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setProductImage(null);
        setPreviewImage(null);
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
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title className="mb-4 text-center text-primary">Add Product</Card.Title>
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
                  <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Image:</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleProductImageChange} required />
                </Form.Group>
                {previewImage && (
                  <Form.Group className="mb-3 text-center">
                    <Form.Label>Image Preview:</Form.Label>
                    <div className="image-preview">
                      <img src={previewImage} alt="Product Preview" className="img-fluid" />
                    </div>
                  </Form.Group>
                )}
                <Button variant="primary" type="submit" className="w-100">Add Product</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowSuccessToast(false)} show={showSuccessToast} delay={3000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>Product added successfully!</Toast.Body>
        </Toast>

        <Toast onClose={() => setShowErrorToast(false)} show={showErrorToast} delay={3000} autohide bg="danger">
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default AddProduct;
