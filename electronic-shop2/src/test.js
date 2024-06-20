import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { getUserId } from './components/pages/Account/userStorageService';
import './S.css'; // Assurez-vous que le fichier CSS est correctement lié

const Orderss = () => {
  const [orders, setOrders] = useState([]);
  const userId = getUserId();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customer/myOrders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="page-container">
      <Container className="content-wrap">
        <Row>
          <Col>
            <h2>My Orders</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.trackingId}</td>
                    <td>{order.amount}</td>
                    <td>{order.orderDescription}</td>
                    <td>{order.address}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>{order.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
     
    </div>
  );
};

export default Orderss;
