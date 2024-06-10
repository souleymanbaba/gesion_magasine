import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaLanguage } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, Modal, Table } from 'react-bootstrap';


const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showTranslateForm, setShowTranslateForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [arabicName, setArabicName] = useState('');

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleArabicNameChange = (e) => {
    setArabicName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/admin/category', newCategory);
      console.log('Nouvelle catégorie créée :', response.data);
      fetchCategories();
      setNewCategory({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/category/${currentCategory.id}`, newCategory);
      console.log('Catégorie mise à jour avec succès');
      fetchCategories();
      setShowUpdateForm(false);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error);
    }
  };

  const handleTranslate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/traduire`, { id: currentCategory.id, arabicName });
      console.log('Nom arabe enregistré avec succès');
      fetchCategories();
      setShowTranslateForm(false);
      setArabicName('');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du nom arabe :', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/category/${categoryId}`);
      console.log('Catégorie supprimée avec succès');
      fetchCategories();
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
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
    <Container className="container">
      <Row className="justify-content-center">
        <Col xs={12}>
          <div className="text-center mb-3">
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <FaPlus className="mr-2" /> Ajouter une catégorie
            </Button>
          </div>
          <div className="table-container">
            <div className="table-wrapper">
              <Table striped bordered hover responsive>
                <thead className="admin-products__table-header">
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="admin-products__table-row">
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>
                        <Button
                          variant="warning"
                          className="mr-2"
                          onClick={() => {
                            setCurrentCategory(category);
                            setNewCategory({ name: category.name, description: category.description });
                            setShowUpdateForm(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="info"
                          className="mr-2"
                          onClick={() => {
                            setCurrentCategory(category);
                            setShowTranslateForm(true);
                          }}
                        >
                          <FaLanguage />
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(category.id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Créer une nouvelle catégorie</Modal.Title>
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
            <Button variant="primary" type="submit" className="btn-block">
              Créer une catégorie
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showUpdateForm} onHide={() => setShowUpdateForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Mettre à jour la catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="formUpdateCategoryName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUpdateCategoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newCategory.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              Mettre à jour la catégorie
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showTranslateForm} onHide={() => setShowTranslateForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Traduire le nom de la catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTranslate}>
            <Form.Group className="mb-3" controlId="formArabicName">
              <Form.Label>Nom en arabe</Form.Label>
              <Form.Control
                type="text"
                value={arabicName}
                onChange={handleArabicNameChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              Enregistrer le nom arabe
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;
