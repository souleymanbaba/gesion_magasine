import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, Modal, Table } from 'react-bootstrap';
import './style.css'; // Importer le fichier CSS personnalisé

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
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
      setNewCategory({ name: '', description: '' });
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
    <div className="admin-products">
      <br></br>
      <br></br>
      <h2 className="admin-products__title">Panneau d’administration</h2>
      <div className="admin-products__add-button">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <FaPlus className="add-button__icon" /> Ajouter une catégorie
        </Button>
      </div>
      <div className="admin-products__table">
        <Table striped bordered hover responsive>
          <thead className="admin-products__table-header">
            <tr>
              <th>ID</th>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="admin-products__table-row">
                <td>{category.id}</td>
                <td>{category.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Créer une nouvelle catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="name" value={newCategory.name} onChange={handleChange} required />
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
            <Button variant="primary" type="submit" block>
              Créer une catégorie
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
