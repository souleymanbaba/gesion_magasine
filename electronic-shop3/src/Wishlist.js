import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import './C.css';
import { getUserId } from './components/pages/Account/userStorageService';

const Wishlist = ({ updateWishlistCount }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [direction, setDirection] = useState('ltr');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const itemsPerPage = 3;
  const userId = getUserId();

  useEffect(() => {
    setDirection(i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customer/wishlist/${userId}`, {
          params: { lang: i18n.language }
        });
        setWishlist(response.data);
        updateWishlistCount(response.data.length);
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [userId, updateWishlistCount, i18n.language]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/customer/wishlist/${itemId}`, {
        params: { lang: i18n.language }
      });
      const updatedWishlist = wishlist.filter(item => item.id !== itemId);
      setWishlist(updatedWishlist);
      updateWishlistCount(updatedWishlist.length);
      setSuccessMessage(t('Item removed from wishlist.'));
      setErrorMessage(''); // Clear any previous error messages

      // Déclencher l'événement personnalisé "budgetUpdated"
      const budgetUpdatedEvent = new CustomEvent('budgetUpdated', { detail: { budget: 'new budget value' } });
      window.dispatchEvent(budgetUpdatedEvent);
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      setErrorMessage(t('Error removing item from wishlist.'));
    }
  };

  const handleTransferAllToCart = async () => {
    try {
      await Promise.all(wishlist.map(item =>
        axios.post(`http://localhost:8080/api/customer/cart`, {
          userId,
          productId: item.productId,
          quantity: 1
        })
      ));
      setSuccessMessage(t('All items transferred to cart successfully.'));
      setErrorMessage(''); // Clear any previous error messages

      // Déclencher l'événement personnalisé "budgetUpdated"
      const budgetUpdatedEvent = new CustomEvent('budgetUpdated', { detail: { budget: 'new budget value' } });
      window.dispatchEvent(budgetUpdatedEvent);

      // Afficher le message de succès pendant 2 secondes avant de recharger la page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error transferring items to cart:', error);
      setErrorMessage(t('Error transferring items to cart. Please try again later.'));
    }
  };

  if (!userId) {
    navigate('/SignIn', { state: { message: t('login_redirect_message') } });
    return null;
  }

  if (loading) {
    return <div className="text-center"><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container style={{ direction: direction }}>
      <Row>
        <Col>
          <h2 className="text-center">{t('Wishlist')}</h2>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {wishlist.length === 0 && !loading && !successMessage && !errorMessage && (
            <div className="text-center" dir={direction}>
              {t('Your wishlist is empty.')}
              <br />
              <Button as={Link} to="/products" variant="primary">{t('Shop Now')}</Button>
            </div>
          )}
          <Row className="justify-content-center">
            {currentItems.map((item) => (
              <Col md={4} key={item.productId} className="mb-4">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={`data:image/jpeg;base64,${item.returnedImg}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{item.productName}</Card.Title>
                    <Card.Text>
                      <strong>{t('Price')}:</strong> {item.price}
                    </Card.Text>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-auto"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> {t('Remove')}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {wishlist.length > 0 && (
            <>
              <div className="text-center mt-4">
                <Button variant="primary" onClick={handleTransferAllToCart}>
                  {t('Transfer All to Cart')}
                </Button>
              </div>
              <Pagination className="justify-content-center mt-4">
                {Array.from({ length: Math.ceil(wishlist.length / itemsPerPage) }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Wishlist;
