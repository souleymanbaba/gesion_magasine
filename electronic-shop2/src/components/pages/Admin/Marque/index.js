import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Modal, Form, Container } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';

const AdminMarques = () => {
  const [marques, setMarques] = useState([]);
  const [currentMarques, setCurrentMarques] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMarque, setSelectedMarque] = useState(null);
  const [formData, setFormData] = useState({ nom: '', nom_ar: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const marquesPerPage = 5;
  const { t, i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const navigate = useNavigate();

  const fetchMarques = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/marques');
      if (!response.ok) {
        throw new Error('Failed to fetch marques');
      }
      const data = await response.json();
      setMarques(data);
      setCurrentMarques(data.slice(0, marquesPerPage));
    } catch (error) {
      console.error('Error fetching marques:', error.message);
    }
  };

  useEffect(() => {
    fetchMarques();
  }, []);

  const handleDeleteMarque = async (marqueId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/marques/${marqueId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete marque');
      }
      setMarques(marques.filter(marque => marque.id !== marqueId));
      if (marques.length % marquesPerPage === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting marque:', error.message);
    }
  };

  const handleViewMarque = (marque) => {
    setSelectedMarque(marque);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMarque(null);
  };

  const handleEditMarque = (marque) => {
    setSelectedMarque(marque);
    setFormData({ nom: marque.nom, nom_ar: marque.nom_ar });
    setShowModal(true);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    const offset = selectedPage * marquesPerPage;
    setCurrentPage(selectedPage);
    setCurrentMarques(marques.slice(offset, offset + marquesPerPage));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const method = selectedMarque ? 'PUT' : 'POST';
      const url = selectedMarque ? `http://localhost:8080/api/marques/${selectedMarque.id}` : 'http://localhost:8080/api/marques';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error(`Failed to ${selectedMarque ? 'update' : 'create'} marque`);
      }
      setShowModal(false);
      setFormData({ nom: '', nom_ar: '' });
      fetchMarques();
    } catch (error) {
      console.error(`Error ${selectedMarque ? 'updating' : 'creating'} marque:`, error.message);
    }
  };

  return (
    <Container fluid>
      <h1 className="mb-4" dir={direction}>{t('marques.title')}</h1>
      <h5 dir={direction}>
        <Link to="#" onClick={() => setShowModal(true)} className="mb-3">
          <Button variant="success" >
            <FaPlus className="mr-2" /> {t('marques.add')}
          </Button>
        </Link>
      </h5>
      <br />
      <Table striped bordered hover className="table-wrapper" dir={direction}>
        <thead>
          <tr>
            <th>{t('marques.nom')}</th>
          
            <th>{t('marques.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {currentMarques.map(marque => (
            <tr key={marque.id}>
           
              <td>{i18n.language === 'ar' ? marque.nom_ar : marque.nom}</td>
              <td>
                <Button variant="primary" onClick={() => handleViewMarque(marque)}>
                  <FaEye />
                </Button>
                <Button variant="warning" onClick={() => handleEditMarque(marque)} className="ml-1">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteMarque(marque.id)} className="ml-1">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMarque ? t('marques.edit') : t('marques.add')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMarqueNom">
              <Form.Label>{t('marques.nom')}</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMarqueNomAr" className="mt-3">
              <Form.Label>{t('marques.nom_ar')}</Form.Label>
              <Form.Control
                type="text"
                name="nom_ar"
                value={formData.nom_ar}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleSubmit}>
              {t('marques.submit')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ReactPaginate
        previousLabel={t('pagination.previous')}
        nextLabel={t('pagination.next')}
        pageCount={Math.ceil(marques.length / marquesPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </Container>
  );
};

export default AdminMarques;
