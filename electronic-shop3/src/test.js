import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Badge, Pagination } from 'react-bootstrap';
import { getUserId } from './components/pages/Account/userStorageService';
import './S.css';
import { useTranslation } from 'react-i18next';

const Orderss = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Nombre d'éléments par page
  const userId = getUserId();
  const { t, i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }, [i18n.language]);

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

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-container" style={{ direction }}>
      <Container className="content-wrap">
        <Row>
          <Col>
            <h2>{t('orders.title')}</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t('Amount')}</th>
                  <th>{t('Numero')}</th>
                  <th>{t('Date')}</th>
                  <th>{t('Status')}</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.amount}</td>
                    <td>{order.address}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>
                      {order.orderStatus === "Shipped" ? (
                        <Badge variant="warning">{t('PStatusShipped')}</Badge>
                      ) : order.orderStatus === "Delivered" ? (
                        <Badge variant="success">{t('PStatusDelivered')}</Badge>
                      ) : (
                        <Badge variant="secondary">{t('PStatusPending')}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Pagination */}
            <Pagination>
              {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Orderss;
