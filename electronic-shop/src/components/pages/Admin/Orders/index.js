import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/placedOrders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/customer/cartI/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const data = await response.json();
      setCartItems(data.cartItems);
      setShowCartModal(true);
    } catch (error) {
      console.error('Error fetching cart items:', error.message);
    }
  };

  const handleChangeStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/order/${selectedOrder.id}/${newStatus}`);
      
      if (response.status === 200) {
        console.log('Statut de la commande mis à jour avec succès !');
        const updatedOrders = orders.map(order => {
          if (order.id === selectedOrder.id) {
            return { ...order, orderStatus: newStatus };
          }
          return order;
        });
        setOrders(updatedOrders);
        setShowStatusModal(false);
      } else {
        console.error('Échec de la mise à jour du statut de la commande');
      }
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
    }
  };

  const handleShowStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setShowStatusModal(true);
  };

  const handleShowCartModal = (order) => {
    fetchCartItems(order.user_id);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 className="my-4">Orders</h1>
      <Table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Address</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.trackingId}</td>
              <td>{order.userName}</td>
              <td>{order.date}</td>
              <td>{order.orderStatus}</td>
              <td>{order.totalAmount}</td>
              <td>{order.address}</td>
              <td>{order.orderDescription}</td>
              <td>
                <Button variant="info" onClick={() => handleShowCartModal(order)}>View Cart</Button>{' '}
                <Button onClick={() => handleShowStatusModal(order)}>Change Status</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control 
                as="select" 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChangeStatus}>
            Change
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cart Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td><img src={`data:image/jpeg;base64,${item.returnedImg}`} alt={item.productNane} style={{ width: '50px' }} /></td>
                    <td>{item.productNane}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No items in the cart</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
