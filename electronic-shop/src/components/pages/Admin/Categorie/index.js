import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, Card, ListGroup, Modal } from 'react-bootstrap';
import './style.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false); // État pour contrôler la visibilité du formulaire

  // Fonction pour gérer les changements dans le formulaire de création de catégorie
  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  // Fonction pour envoyer une requête POST pour créer une nouvelle catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/admin/category', newCategory);
      console.log('New category created:', response.data);
      // Actualiser la liste des catégories après la création d'une nouvelle catégorie
      fetchCategories();
      // Réinitialiser le formulaire et masquer le formulaire
      setNewCategory({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Fonction pour récupérer toutes les catégories à partir du serveur
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Utiliser useEffect pour récupérer les catégories au chargement initial du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h2 className="mb-4 text-primary">All Categories</h2>
          <Card className="shadow-sm">
            <ListGroup variant="flush">
              {categories.map((category) => (
                <ListGroup.Item key={category.id}>
                  <strong>{category.name}</strong>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="text-center">
                <Button variant="link" onClick={() => setShowForm(true)} className="text-primary">
                  <FaPlus /> Add Category
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={6}>
          <Modal show={showForm} onHide={() => setShowForm(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Create New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formCategoryName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newCategory.id}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCategoryDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={newCategory.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Create Category
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryManagement;
