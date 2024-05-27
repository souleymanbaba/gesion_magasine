import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryName: '',
    marque: '',
    taille: '',
    image: null
  });

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setProduct({
      ...product,
      image: imageFile
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) {
      console.error('Product ID is null');
      return;
    }
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('categoryName', product.categoryName);
    formData.append('marque', product.marque);
    formData.append('taille', product.taille);
    if (product.image) {
      formData.append('image', product.image);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`, {
        method: 'PUT',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  };

  return (
    <div className="update-product">
      <h1 className="text-center">Update Product</h1>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={product.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                value={product.categoryName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMarque">
              <Form.Label>Marque</Form.Label>
              <Form.Control
                type="text"
                name="marque"
                value={product.marque}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTaille">
              <Form.Label>Taille</Form.Label>
              <Form.Control
                type="text"
                name="taille"
                value={product.taille}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">
                Update
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateProduct;
