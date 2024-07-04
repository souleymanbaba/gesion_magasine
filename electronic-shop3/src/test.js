import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { getUserId , getlang} from './components/pages/Account/userStorageService';
import './S.css'; // Assurez-vous que le fichier CSS est correctement lié
import { useTranslation } from 'react-i18next';


const Orderss = () => {
  const [orders, setOrders] = useState([]);
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
    const fetchOrders = async (lang) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customer/myOrders/${userId}` , { params: { lang } });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

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
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.amount}</td>
                    <td>{order.address}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    {order.orderStatus === "Pending" ? t('PStatusPending') : t('PStatusOther')}
                    
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
