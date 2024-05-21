import { getUserId } from './components/pages/Account/userStorageService';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Table, Image, Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    address: '',
    orderDescription: ''
  });
  const userId = getUserId();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customer/cart/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, [userId]);

  const handleQuantityChange = async (itemId, delta) => {
    try {
      await axios.post('http://localhost:8080/api/customer/addition', { productId: itemId, userId });
      const response = await axios.get(`http://localhost:8080/api/customer/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const hhandleQuantityChange = async (itemId, delta) => {
    try {
      await axios.post('http://localhost:8080/api/customer/deduction', { productId: itemId, userId });
      const response = await axios.get(`http://localhost:8080/api/customer/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        userId,
        address: orderData.address,
        orderDescription: orderData.orderDescription
      };
      await axios.post('http://localhost:8080/api/customer/placeOrder', orderPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>Cart Details</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {cart.cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.productNane}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => hhandleQuantityChange(item.productId, 1)}
                      disabled={item.quantity < 1}
                    >
                      {item.quantity === 1 ? 'Supprime' : <FontAwesomeIcon icon={faMinus} />}
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
                  <td>
                    <Image src={`data:image/jpeg;base64,${item.returnedImg}`} thumbnail />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h3>Total Amount: {cart.totalAmount}</h3>
          <h4>Order Status: {cart.orderStatus}</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>Place Order</Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Place Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formOrderDescription">
              <Form.Label>Order Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Order Description"
                name="orderDescription"
                value={orderData.orderDescription}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
