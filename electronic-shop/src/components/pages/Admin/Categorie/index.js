import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, Card, ListGroup, Modal } from 'react-bootstrap';
import './style.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', parentCategoryId: '' });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/admin/category', newCategory);
      console.log('Nouvelle catégorie créée :', response.data);
      fetchCategories();
      setNewCategory({ name: '', description: '', parentCategoryId: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin');
      console.log('Catégories récupérées :', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container className="my-5">
      <Row>
        <Col md={2}>
          {/* Sidebar */}
          <div className="bg-light p-3" style={{ height: '100vh' }}>
            {/* Contenu de la barre latérale */}
          </div>
        </Col>

        <Col md={10}>
          <Row>
            <Col md={6}>
              <h2 className="mb-4 text-primary">Toutes les catégories</h2>
              <Card className="shadow-sm">
                <ListGroup variant="flush">
                  {categories.length === 0 ? (
                    <ListGroup.Item>Aucune catégorie disponible.</ListGroup.Item>
                  ) : (
                    categories.map((category) => (
                      <ListGroup.Item key={category.id}>
                        <strong>{category.name}</strong>
                        <p>{category.description}</p>
                        {category.parentCategory && (
                          <small className="text-muted">Parent : {category.parentCategory.name}</small>
                        )}
                      </ListGroup.Item>
                    ))
                  )}
                  <ListGroup.Item className="text-center">
                    <Button variant="primary" onClick={() => setShowForm(true)}>
                      <FaPlus /> Ajouter une catégorie
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col md={6}  className="mb-4 text-primary">
              <Modal show={showForm} onHide={() => setShowForm(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Créer une nouvelle catégorie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formCategoryName">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={newCategory.name}
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
                    <Form.Group className="mb-3" controlId="formParentCategoryId">
                      <Form.Label>Catégorie parente</Form.Label>
                      <Form.Control
                        as="select"
                        name="parentCategoryId"
                        value={newCategory.parentCategoryId}
                        onChange={handleChange}
                      >
                        <option value="">Aucune catégorie parente</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                      Créer une catégorie
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryManagement;
