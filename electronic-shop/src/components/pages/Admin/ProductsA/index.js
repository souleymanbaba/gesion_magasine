// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Button, Table, Modal, Form, Container } from 'react-bootstrap';
// import { FaPlus, FaEye, FaEdit, FaTrash, FaLanguage, FaArrowCircleUp } from 'react-icons/fa';
// import ReactPaginate from 'react-paginate';
// import { useTranslation } from 'react-i18next';

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [currentProducts, setCurrentProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showTranslationForm, setShowTranslationForm] = useState(false);
//   const [showMovementForm, setShowMovementForm] = useState(false);
//   const [translations, setTranslations] = useState({});
//   const [formData, setFormData] = useState({
//     type: '',
//     quantite: 0,
//     remarque: '',
//     dateMouvement: '' // Nouveau champ pour la date du mouvement
//   });
//   const [formDataValid, setFormDataValid] = useState(false); // État pour la validation du formulaire
//   const [currentPage, setCurrentPage] = useState(0);
//   const productsPerPage = 5;
//   const { t, i18n } = useTranslation();
//   const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

//   // Fetch des produits depuis l'API
//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/admin/products');
//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }
//       const data = await response.json();
//       setProducts(data);
//       setCurrentProducts(data.slice(0, productsPerPage));
//     } catch (error) {
//       console.error('Error fetching products:', error.message);
//     }
//   };

//   // Utilisation de useEffect pour charger les produits au montage du composant
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Suppression d'un produit
//   const handleDeleteProduct = async (productId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to delete product');
//       }
//       setProducts(products.filter(product => product.id !== productId));
//     } catch (error) {
//       console.error('Error deleting product:', error.message);
//     }
//   };

//   // Affichage de l'image d'un produit dans une modal
//   const handleViewImage = (product) => {
//     setSelectedProduct(product);
//     setShowModal(true);
//   };

//   // Fermeture de la modal
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedProduct(null);
//   };

//   // Gestion du clic sur le bouton de traduction
//   const handleTranslationClick = (product) => {
//     setSelectedProduct(product);
//     setShowTranslationForm(true);
//   };

//   // Gestion du changement dans les champs de traduction
//   const handleTranslationChange = (field, value) => {
//     setTranslations({
//       ...translations,
//       [field]: value
//     });
//   };

//   // Soumission du formulaire de traduction
//   const handleTranslationSubmit = async () => {
//     if (!selectedProduct) return;

//     const productId = selectedProduct.id;
//     const translationData = {
//       name_ar: translations.name,
//       marque_ar: translations.marque,
//       description_ar: translations.description,
//       taille_ar: translations.taille,
//     };

//     try {
//       const response = await fetch(`http://localhost:8080/api/admin/product/${productId}/translation`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(translationData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit translation');
//       }

//       console.log('Translation submitted successfully');
//       setShowTranslationForm(false);
//       setSelectedProduct(null);
//       setTranslations({});
//       fetchProducts(); // Rafraîchir la liste des produits après la traduction
//     } catch (error) {
//       console.error('Error submitting translation:', error.message);
//     }
//   };

//   // Pagination des produits
//   const handlePageClick = (data) => {
//     const selectedPage = data.selected;
//     const offset = selectedPage * productsPerPage;
//     setCurrentPage(selectedPage);
//     setCurrentProducts(products.slice(offset, offset + productsPerPage));
//   };

//   // Gestion des changements dans les champs du formulaire de mouvement
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//     validateFormData(); // Appel de la fonction de validation à chaque changement dans les données du formulaire
//   };

//   // Validation des données du formulaire de mouvement
//   const validateFormData = () => {
//     // Validation de base : vérifier que type et quantite ne sont pas vides ou zéro
//     const { type, quantite } = formData;
//     const isValid = type !== '' && quantite > 0;
//     setFormDataValid(isValid);
//   };

//   // Ajout d'un mouvement
//   const handleAddMovement = (productId) => {
//     setSelectedProduct(products.find(product => product.id === productId));
//     setShowMovementForm(true);
//   };

//   // Soumission du formulaire de mouvement
//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/admin/mouvement', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           productId: selectedProduct.id,
//           ...formData,
//           dateMouvement: new Date().toISOString() // Utilisation de la date actuelle pour dateMouvement
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add movement');
//       }

//       setFormData({
//         type: '',
//         quantite: 0,
//         remarque: '',
//         dateMouvement: '' // Réinitialisation du champ dateMouvement après soumission
//       });

//       setShowMovementForm(false);

//       fetchProducts(); // Rafraîchir la liste des produits après l'ajout du mouvement
//     } catch (error) {
//       console.error('Error adding movement:', error.message);
//     }
//   };

//   return (
//     <Container className="mt-4 d-flex flex-column align-items-center">
//       <h1 className="mb-4">{t('products.title')}</h1>
//       <Link to="/admin/products/new" className="mb-3">
//         <Button variant="success">
//           <FaPlus className="mr-2" /> {t('products.add')}
//         </Button>
//       </Link>
//       <Table striped bordered hover className="mb-5" dir={direction}>
//         <thead>
//           <tr>
//             <th>{t('products.name')}</th>
//             <th>{t('products.price')}</th>
//             <th>{t('products.category')}</th>
//             <th>{t('products.marque')}</th>
//             <th>{t('products.taille')}</th>
//             <th>{t('products.stock_quantity')}</th>
//             <th>{t('products.actions')}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentProducts.map(product => (
//             <tr key={product.id}>
//               <td>{product.name}</td>
//               <td>{product.price}</td>
//               <td>{product.categoryName}</td>
//               <td>{product.marque}</td>
//               <td>{product.taille}</td>
//               <td>{product.quantiteStock}</td>
//               <td>
//                 <Button variant="primary" onClick={() => handleViewImage(product)}>
//                   <FaEye />
//                 </Button>
//                 <Link to={`/admin/products/${product.id}/edit`} className="btn btn-warning ml-1">
//                   <FaEdit />
//                 </Link>
//                 <Button variant="danger" onClick={() => handleDeleteProduct(product.id)} className="ml-1">
//                   <FaTrash />
//                 </Button>
//                 <Button variant="secondary" onClick={() => handleTranslationClick(product)} className="ml-1">
//                   <FaLanguage />
//                 </Button>
//                 <Button variant="info" onClick={() => handleAddMovement(product.id)} className="ml-1">
//                   <FaArrowCircleUp />
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//            {/* Modal pour afficher l'image du produit */}
//            <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedProduct ? selectedProduct.name : t('products.product_image')}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedProduct && (
//             <img 
//               src={`data:image/png;base64,${selectedProduct.byteimg}`} 
//               alt={selectedProduct.name} 
//               className="img-fluid" 
//             />
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             {t('pagination.previous')}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal pour le formulaire de traduction */}
//       <Modal show={showTranslationForm} onHide={() => setShowTranslationForm(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{t('products.translate')}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formProductName">
//               <Form.Label>{t('products.name')}</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder={t('products.enter_translation')}
//                 value={translations.name || ''}
//                 onChange={(e) => handleTranslationChange('name', e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formProductDescription" className="mt-3">
//               <Form.Label>{t('products.description')}</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 placeholder={t('products.enter_translation')}
//                 value={translations.description || ''}
//                 onChange={(e) => handleTranslationChange('description', e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formProductMarque" className="mt-3">
//               <Form.Label>{t('products.marque')}</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder={t('products.enter_translation')}
//                 value={translations.marque || ''}
//                 onChange={(e) => handleTranslationChange('marque', e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formProductTaille" className="mt-3">
//               <Form.Label>{t('products.taille')}</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder={t('products.enter_translation')}
//                 value={translations.taille || ''}
//                 onChange={(e) => handleTranslationChange('taille', e.target.value)}
//               />
//             </Form.Group>
//             <Button variant="primary" className="mt-3" onClick={handleTranslationSubmit}>
//               {t('products.submit_translation')}
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Modal pour le formulaire d'ajout de mouvement */}
//       <Modal show={showMovementForm} onHide={() => setShowMovementForm(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{t('products.add_movement')}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formMovementType">
//               <Form.Label>{t('products.type')}</Form.Label>
//               <Form.Control
//                 as="select"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//               >
//                 <option value="">{t('products.select_movement_type')}</option>
//                 <option value="ENTREE">{t('products.entry')}</option>
//                 <option value="SORTIE">{t('products.exit')}</option>
//               </Form.Control>
//             </Form.Group>
//             <Form.Group controlId="formMovementQuantity">
//               <Form.Label>{t('products.quantity')}</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="quantite"
//                 value={formData.quantite}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="formMovementRemark">
//               <Form.Label>{t('products.remark')}</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="remarque"
//                 value={formData.remarque}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="formMovementDate">
//               <Form.Label>{t('products.date_movement')}</Form.Label>
//               <Form.Control
//                 type="date"
//                 name="dateMouvement"
//                 value={formData.dateMouvement}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowMovementForm(false)}>
//             {t('products.cancel')}
//           </Button>
//           <Button variant="primary" onClick={handleSubmit} disabled={!formDataValid}>
//             {t('products.add')}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Pagination des produits */}
//       <ReactPaginate
//         previousLabel={t('pagination.previous')}
//         nextLabel={t('pagination.next')}
//         pageCount={Math.ceil(products.length / productsPerPage)}
//         marginPagesDisplayed={2}
//         pageRangeDisplayed={5}
//         onPageChange={handlePageClick}
//         containerClassName={'pagination'}
//         subContainerClassName={'pages pagination'}
//         activeClassName={'active'}
//       />
//     </Container>
//   );
// };

// export default AdminProducts;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Modal, Form, Container } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash, FaLanguage, FaArrowCircleUp, FaExchangeAlt } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTranslationForm, setShowTranslationForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [translations, setTranslations] = useState({});
  const [formData, setFormData] = useState({
    type: '',
    quantite: 0,
    remarque: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const { t, i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/products');
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
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/product/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(products.filter(product => product.id !== productId));
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
    const offset = selectedPage * productsPerPage;
    setCurrentPage(selectedPage);
    setCurrentProducts(products.slice(offset, offset + productsPerPage));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
          productId: selectedProduct.id, // Utilize the ID of the selected product
          ...formData,
          dateMouvement: new Date().toISOString() // Add the movement date
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add movement');
      }

      // Reset the form after successful submission
      setFormData({
        type: '',
        quantite: 0,
        remarque: ''
      });

      // Close the form after successful submission if necessary
      setShowMovementForm(false);

      // Refresh the list of products after adding movement if necessary
      fetchProducts();
    } catch (error) {
      console.error('Error adding movement:', error.message);
    }
  };

  const handleTransactionClick = (productId) => {
    navigate(`/admin/products/${productId}/transactions`);
  };

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h1 className="mb-4">{t('products.title')}</h1>
      <Link to="/admin/products/new" className="mb-3">
        <Button variant="success">
          <FaPlus className="mr-2" /> {t('products.add')}
        </Button>
      </Link>
      <Table striped bordered hover className="mb-5" dir={direction}>
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
                <Button variant="info" onClick={() => handleTransactionClick(product.id)} className="ml-1">
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
            <Form.Group controlId="formProductDescription" className="mt-3">
              <Form.Label>{t('products.description')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={t('products.enter_translation')}
                value={translations.description || ''}
                onChange={(e) => handleTranslationChange('description', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProductMarque" className="mt-3">
              <Form.Label>{t('products.marque')}</Form.Label>
              <Form.Control
                type="text"                 placeholder={t('products.enter_translation')}
                value={translations.marque || ''}
                onChange={(e) => handleTranslationChange('marque', e.target.value)}
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

      <ReactPaginate
        previousLabel={t('pagination.previous')}
        nextLabel={t('pagination.next')}
        pageCount={Math.ceil(products.length / productsPerPage)}
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

