import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Modal, Form, Container, Alert, FormControl } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash, FaLanguage, FaArrowCircleUp, FaExchangeAlt, FaFileImport } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { formatISO } from 'date-fns';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTranslationForm, setShowTranslationForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // State for import modal
  const [translations, setTranslations] = useState({});
  const [formData, setFormData] = useState({
    type: '',
    quantite: 0,
    remarque: '',
    dateMouvement: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [importFile, setImportFile] = useState(null); // State for file input
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const productsPerPage = 5;
  const { t, i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const lang = i18n.language;
      const response = await fetch(`http://localhost:8080/api/admin/products?lang=${lang}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setCurrentProducts(data.slice(0, productsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [i18n.language]); // Refetch products when language changes

  useEffect(() => {
    const offset = currentPage * productsPerPage;
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentProducts(filteredProducts.slice(offset, offset + productsPerPage));
  }, [products, currentPage, searchTerm]);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(products.filter(product => product.id !== productId));
      if (products.length % productsPerPage === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  const handleViewImage = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleTranslationClick = (product) => {
    setSelectedProduct(product);
    setShowTranslationForm(true);
  };

  const handleTranslationChange = (field, value) => {
    setTranslations({
      ...translations,
      [field]: value
    });
  };

  const handleTranslationSubmit = async () => {
    if (!selectedProduct) return;

    const productId = selectedProduct.id;
    const translationData = {
      name_ar: translations.name,
      marque_ar: translations.marque,
      description_ar: translations.description,
      taille_ar: translations.taille,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}/translation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit translation');
      }

      console.log('Translation submitted successfully');
      setShowTranslationForm(false);
      setSelectedProduct(null);
      setTranslations({});
      fetchProducts(); // Refresh product list after translation
    } catch (error) {
      console.error('Error submitting translation:', error.message);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInputChangeS = (e) => {
    const { name, value } = e.target;
    
    // Formatage de la date en LocalDateTime
    const formattedValue = name === 'dateMouvement' ? formatISO(new Date(value), { representation: 'date' }) : value;

    setFormData(prevState => ({
      ...prevState,
      [name]: formattedValue
    }));
  };

  const handleAddMovement = (productId) => {
    setSelectedProduct(products.find(product => product.id === productId));
    setShowMovementForm(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/mouvement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: selectedProduct.id, 
          ...formData 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add movement');
      }

      // Reset the form after successful submission
      setFormData({
        type: '',
        quantite: 0,
        remarque: '',
        dateMouvement: ''
      });

      // Close the form after successful submission if necessary
      setShowMovementForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding movement:', error.message);
    }
  };

  const handleTransactionClick = (productId, productName) => {
    navigate(`/admin/products/${productId}/${productName}/transactions`);
  };

  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const handleImportSubmit = async () => {
    if (!importFile) return;

    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const response = await axios.post('http://localhost:8080/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status !== 200) {
        throw new Error('Failed to import products');
      }

      setShowImportModal(false);
      setAlertMessage('Products imported successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error importing products:', error.message);
      setAlertMessage('Error importing products');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to the first page whenever search term changes
  };

  const handleDownloadTemplate = () => {
    // Télécharger le fichier example.xlsx
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/example.xlsx`;
    link.download = 'example.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container fluid>
      {alertMessage && <Alert variant="success">{alertMessage}</Alert>}
      <div className="d-flex justify-content-between align-items-center mb-4" dir={direction}>
        <h1>{t('products.title')}</h1>
        <h5 dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <div>
            <Link to="/admin/products/new" className="mr-2">
              <Button variant="success">
                <FaPlus className="mr-2" /> {t('products.add')}
              </Button>
            </Link>
            <Button variant="primary" onClick={() => setShowImportModal(true)}>
              <FaFileImport className="mr-2" /> {t('products.import')}
            </Button>
          </div>
        </h5>
      </div>
      <FormControl
        type="text"
        placeholder={t('products.recherche')}
        className="mb-3"
        value={searchTerm}
        onChange={handleSearchChange}
        dir={direction}
      />
      <Table striped bordered hover className="table-wrapper" dir={direction}>
        <thead>
          <tr>
            <th>{t('products.name')}</th>
            <th>{t('products.price')}</th>
            <th>{t('products.category')}</th>
            <th>{t('products.marque')}</th>
            <th>{t('products.taille')}</th>
            <th>{t('products.stock_quantity')}</th>
            <th>{t('products.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.categoryName}</td>
              <td>{product.marque}</td>
              <td>{product.taille}</td>
              <td>{product.quantiteStock}</td>
              <td>
                <Button variant="primary" onClick={() => handleViewImage(product)}>
                  <FaEye />
                </Button>
                <Link to={`/admin/products/${product.id}/edit`} className="btn btn-warning ml-1">
                  <FaEdit />
                </Link>
                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)} className="ml-1">
                  <FaTrash />
                </Button>
                <Button variant="secondary" onClick={() => handleTranslationClick(product)} className="ml-1">
                  <FaLanguage />
                </Button>
                <Button variant="info" onClick={() => handleAddMovement(product.id)} className="ml-1">
                  <FaArrowCircleUp />
                </Button>
                <Button variant="info" onClick={() => handleTransactionClick(product.id, product.name)} className="ml-1">
                  <FaExchangeAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? selectedProduct.name : t('products.product_image')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <img 
              src={`data:image/png;base64,${selectedProduct.byteimg}`} 
              alt={selectedProduct.name} 
              className="img-fluid" 
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t('pagination.previous')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTranslationForm} onHide={() => setShowTranslationForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('products.translate')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>{t('products.name')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('products.enter_translation')}
                value={translations.name || ''}
                onChange={(e) => handleTranslationChange('name', e.target.value)}
              />
            </Form.Group>
            
        
            <Form.Group controlId="formProductTaille" className="mt-3">
              <Form.Label>{t('products.taille')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('products.enter_translation')}
                value={translations.taille || ''}
                onChange={(e) => handleTranslationChange('taille', e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleTranslationSubmit}>
              {t('products.submit_translation')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showMovementForm} onHide={() => setShowMovementForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('products.add_movement')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMovementType">
              <Form.Label>{t('products.type')}</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="">{t('products.select_movement_type')}</option>
                <option value="ENTREE">{t('products.entry')}</option>
                <option value="SORTIE">{t('products.exit')}</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formMovementQuantity">
              <Form.Label>{t('products.quantity')}</Form.Label>
              <Form.Control
                type="number"
                name="quantite"
                value={formData.quantite}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMovementRemark">
              <Form.Label>{t('products.remark')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="remarque"
                value={formData.remarque}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMovementDate">
              <Form.Label>{t('products.date_movement')}</Form.Label>
              <Form.Control
                type="date"
                name="dateMouvement"
                value={formData.dateMouvement}
                onChange={handleInputChangeS}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMovementForm(false)}>
            {t('products.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {t('products.add')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('products.import')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>{t('products.select_file')}</Form.Label>
              <Form.Control
                type="file"
                accept=".xlsx"
                onChange={handleImportFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            {t('products.cancel')}
          </Button>
          <Button variant="primary" onClick={handleImportSubmit}>
            {t('products.import')}
          </Button>
          <Button variant="info" onClick={handleDownloadTemplate}>
            {t('products.download_template')}
          </Button>
        </Modal.Footer>
      </Modal>

      <ReactPaginate
        previousLabel={t('pagination.previous')}
        nextLabel={t('pagination.next')}
        pageCount={Math.ceil(products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).length / productsPerPage)}
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

export default AdminProducts;
