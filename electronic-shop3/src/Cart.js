import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Pagination
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserId, getlang } from './components/pages/Account/userStorageService';
import MapModal from './MapModal';
import './C.css';

const Cart = ({ updateCartCount }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [direction, setDirection] = useState('ltr');
  const [cart, setCart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [orderData, setOrderData] = useState({
    address: '',
    orderDescription: ''
  });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const userId = getUserId();

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }, [i18n.language]);

  const fetchCartData = async (lang) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/customer/cart/${userId}`, { params: { lang } });
      setCart(response.data);
      updateCartCount(response.data.cartItems.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const lang = getlang();
    fetchCartData(lang);
  }, [userId, updateCartCount, i18n.language]);

  const handleQuantityChange = async (itemId, delta) => {
    try {
      await axios.post('http://localhost:8080/api/customer/addition', {
        productId: itemId,
        userId
      });
      const lang = getlang();
      fetchCartData(lang);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDecrementQuantity = async (itemId) => {
    try {
      await axios.post('http://localhost:8080/api/customer/deduction', {
        productId: itemId,
        userId
      });
      const lang = getlang();
      fetchCartData(lang);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/customer/items/${cartItemId}`);
      const lang = getlang();
      fetchCartData(lang);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderData.address) {
      setErrorMessage(t('en.Please fill in all fields'));
      return;
    }

    if (orderData.address.length < 8) {
      setErrorMessage(t('en.Numero must be at least 8 characters.'));
      return;
    }

    setPlacingOrder(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const orderPayload = {
        userId,
        address: orderData.address,
        orderDescription: orderData.orderDescription,
        latitude: latitude || null,
        longitude: longitude || null
      };
      const response = await axios.post('http://localhost:8080/api/customer/placeOrder', orderPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response from placeOrder API:', response);

      if (response.status === 200) {
        setOrderPlaced(true);
        setCart(null);
        updateCartCount(0);
        setErrorMessage(t('en.Failed to place order. Please try again.'));
        setShowModal(false);
      } else {
        setSuccessMessage(t('en.Order placed successfully.'));
      }
    } catch (success) {
      console.log("Votre commande a été passée avec succès!");
      setSuccessMessage(t('en.Order placed successfully.'));
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };

  const handleOpenMapModal = () => {
    setShowMapModal(true);
  };

  const setCoordinates = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setShowMapModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCartItems = cart ? cart.cartItems.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    return null;
  }

  return (
    <Container style={{ direction: direction }}>
      <Row>
        <Col md={8}>
          <h2>{t('en.Cart')}</h2>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {orderPlaced ? (
            <Button 
              variant="link" 
              href={`/orders`}  
              style={{ 
                fontFamily: "'Open Sans Condensed', sans-serif", 
                fontSize: '1.2rem', 
                height: '50px', 
                backgroundColor: "rgb(67, 0, 86)"
              }}
            >
              {t('en.View Order Status')}
            </Button>
          ) : (
            <>
              {cart ? (
                <div>
                  {currentCartItems.map((item) => (
                    <Card className="mb-3" key={item.id}>
                      <Row className="g-0">
                        <Col md={4}>
                          <Image
                            src={`data:image/jpeg;base64,${item.returnedImg}`}
                            thumbnail
                            style={{ width: '100%', height: '100%' }}
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Body>
                            <Card.Title>{item.marque}</Card.Title>
                            <Card.Text>{t('products.taille')}: {item.taille}</Card.Text>
                            <Card.Text>{t('en.Price')}: {item.price}</Card.Text>
                            <div className="d-flex align-items-center">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => item.quantity === 1 ? handleRemoveItem(item.id) : handleDecrementQuantity(item.productId)}
                              >
                                {item.quantity === 1 ? (
                                  <>
                                    <FontAwesomeIcon icon={faTrash} /> 
                                  </>
                                ) : (
                                  <FontAwesomeIcon icon={faMinus} />
                                )}
                              </Button>
                              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.productId, 1)}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Pagination className="mt-3">
                    {Array.from({ length: Math.ceil(cart.cartItems.length / itemsPerPage) }, (_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              ) : (
                <Button variant="link" href={`/test`}
                  style={{ 
                    fontFamily: "'Open Sans Condensed', sans-serif", 
                    fontSize: '1.2rem', 
                    height: '50px', 
                    backgroundColor: "rgb(67, 0, 86)"
                  }}>
                  {t('en.View Order Status')}
                </Button>
              )}
            </>
          )}
        </Col>
        <Col md={4}>
          <br></br>
          <br></br>
          {cart && (
            <div className="cart-summary">
              <p>{t('en.Total Items')}: {cart.cartItems.length}</p>
              <p>{t('en.Total Amount')}: {cart.totalAmount}</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                {t('en.Place Order')}
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => { setShowModal(false); setSuccessMessage(''); setErrorMessage(''); }} >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{t('en.Place Order')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId="formAddress">
              <Form.Label>{t('en.Numero')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('en.Enter Numero')}
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <br></br>
            <Button variant="secondary" onClick={handleOpenMapModal}>
              {t('en.Select on Map')}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('en.Close')}
          </Button>
          <Button variant="primary" onClick={handlePlaceOrder} disabled={placingOrder}>
            {placingOrder ? <Spinner animation="border" size="sm" /> : t('en.Place Order')}
          </Button>
        </Modal.Footer>
      </Modal>

      <MapModal show={showMapModal} handleClose={() => setShowMapModal(false)} setCoordinates={setCoordinates} />
    </Container>
  );
};

export default Cart;
