import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Table,
  Image,
  Button,
  Modal,
  Form,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserId, getlang } from './components/pages/Account/userStorageService';
import MapModal from './MapModal';
import './C.css';

const Cart = ({ updateCartCount }) => {
  const { t, i18n } = useTranslation();
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
    if (!orderData.address ) {
      setErrorMessage(t('en.Please fill in all fields.'));
      return;
    }

    setPlacingOrder(true);
    setErrorMessage('');
    setSuccessMessage('');

    setShowModal(false); // Fermez le modal ici

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

      console.log('Response from placeOrder API:', response); // Debug statement

      if (response.status === 200) {
        setOrderPlaced(true);
        setCart(null);
        updateCartCount(0);
        setSuccessMessage(t('en.Order placed successfully.'));
      } else {
        setErrorMessage(t(''));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage(t(''));
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container style={{ direction: direction }}>
      <Row>
        <Col>
          <h2>{t('en.Cart')}</h2>
          {userId ? (
            <>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {orderPlaced ? (
                <Button variant="link" href={`/orders`}>
                  {t('en.View Order Status')}
                </Button>
              ) : (
                <>
                  {cart ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>{t('en.Image')}</th>
                          <th>{t('en.Quantity')}</th>
                          <th>{t('en.Price')}</th>
                          <th>{t('products.marque')}</th>
                          <th>{t('products.taille')}</th>
                          <th>{t('en.Actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <Image
                                src={`data:image/jpeg;base64,${item.returnedImg}`}
                                thumbnail
                                style={{ width: '100px', height: '100px' }}
                              />
                            </td>
                            <td>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleDecrementQuantity(item.productId)}
                                disabled={item.quantity < 1}
                              >
                                {item.quantity === 1 ? t('Remove') : <FontAwesomeIcon icon={faMinus} />}
                              </Button>
                              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.productId, 1)}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </td>
                            <td>{item.price}</td>
                            <td>{item.marque}</td>
                            <td>{item.taille}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Button variant="link" href={`/test`}>
                      {t('en.View Order Status')}
                    </Button>
                  )}
                  {cart && cart.totalAmount > 0 && (
                    <>
                      <h3>{t('en.Total Amount')}: {cart.totalAmount}</h3>
                      <h4>{t('en.Order Status')}: {cart.orderStatus}</h4>
                      <Button variant="primary" onClick={() => setShowModal(true)}>
                        {t('en.Place Order')}
                      </Button>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <div>
              <p>{t('en.Please log in to view your cart.')}</p>
              {/* You can add a login link/button here if needed */}
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Modal.Header closeButton className={i18n.language === 'ar' ? 'modal-header-rtl' : ''}>
        <Modal.Title>{t('en.Place Order')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          
          <br />
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
