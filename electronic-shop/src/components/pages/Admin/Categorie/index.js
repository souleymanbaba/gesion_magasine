import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaLanguage } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, Modal, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showTranslateForm, setShowTranslateForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [arabicName, setArabicName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const categoriesPerPage = 5;
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleArabicNameChange = (e) => {
    setArabicName(e.target.value);
  };

  const getDirection = (lang) => {
    if (['ar', 'he', 'fa', 'ur'].includes(lang)) {
      return 'rtl';
    }
    return 'ltr';
  };
  
  const [direction, setDirection] = useState(getDirection(i18n.language));
  
  useEffect(() => {
    setDirection(getDirection(i18n.language));
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/admin/category', newCategory);
      console.log(t('messages.new_category_created'), response.data);
      fetchCategories();
      setNewCategory({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error(t('messages.error_creating_category'), error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/category/${currentCategory.id}`, newCategory);
      console.log(t('messages.category_updated'));
      fetchCategories();
      setShowUpdateForm(false);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error(t('messages.error_updating_category'), error);
    }
  };

  const handleTranslate = async () => {
    setShowTranslateForm(true);
    setArabicName(currentCategory?.arabicName || '');
  };

  const handleSaveArabicName = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/admin/category/${currentCategory.id}/translate`,
        { nom_ar: arabicName }
      );
      console.log(t('messages.arabic_name_saved'));
      fetchCategories();
      setShowTranslateForm(false);
      setArabicName('');
    } catch (error) {
      console.error(t('messages.error_saving_arabic_name'), error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/category/${categoryId}`);
      console.log(t('messages.category_deleted'));
      fetchCategories();
    } catch (error) {
      console.error(t('messages.error_deleting_category'), error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/categories');
      console.log(t('messages.fetch_categories'), response.data);
      setCategories(response.data);
      setCurrentCategories(response.data.slice(0, categoriesPerPage));
    } catch (error) {
      console.error(t('messages.error_fetching_categories'), error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    const offset = selectedPage * categoriesPerPage;
    setCurrentPage(selectedPage);
    setCurrentCategories(categories.slice(offset, offset + categoriesPerPage));
  };

  return (
    <Container className="container" style={{ direction }}>
      <Row className="justify-content-center">
        <Col xs={12}>
          <div className="text-center mb-3">
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <FaPlus className="mr-2" /> {t('buttons.add_category')}
            </Button>
          </div>
          <div className="table-container">
            <div className="table-wrapper">
              <Table striped bordered hover responsive>
                <thead className="admin-products__table-header">
                  <tr>
                    <th>{t('labels.id')}</th>
                    <th>{t('labels.name')}</th>
                    <th>{t('labels.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((category) => (
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
                            handleTranslate();
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
              <ReactPaginate
                previousLabel={t('buttons.previous')}
                nextLabel={t('buttons.next')}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(categories.length / categoriesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">{t('header.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label>{t('labels.name')}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder={t('placeholders.category_name')}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCategoryDescription">
              <Form.Label>{t('labels.description')}</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newCategory.description}
                onChange={handleChange}
                placeholder={t('placeholders.category_description')}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              {t('buttons.create_category')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showUpdateForm} onHide={() => setShowUpdateForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">{t('buttons.update_category')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="formUpdateCategoryName">
              <Form.Label>{t('labels.name')}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder={t('placeholders.category_name')}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUpdateCategoryDescription">
              <Form.Label>{t('labels.description')}</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newCategory.description}
                onChange={handleChange}
                placeholder={t('placeholders.category_description')}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              {t('buttons.save')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showTranslateForm} onHide={() => setShowTranslateForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">{t('buttons.translate_category')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveArabicName}>
            <Form.Group className="mb-3" controlId="formArabicName">
              <Form.Label>{t('labels.arabic_name')}</Form.Label>
              <Form.Control
                type="text"
                value={arabicName}
                onChange={handleArabicNameChange}
                placeholder={t('placeholders.arabic_name')}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block">
              {t('buttons.save')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;
