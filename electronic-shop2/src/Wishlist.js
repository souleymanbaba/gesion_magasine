import { getUserId } from './components/pages/Account/userStorageService';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Table, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Wishlist = ({ updateWishlistCount }) => {
  const [t, i18n] = useTranslation();
  const [direction, setDirection] = useState('ltr');
  const [wishlist, setWishlist] = useState([]);
  const userId = getUserId();

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }, [i18n.language]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customer/wishlist/${userId}`);
        setWishlist(response.data);
        updateWishlistCount(response.data.length);
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
      }
    };

    fetchWishlistData();
  }, [userId, updateWishlistCount]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/customer/wishlist/${itemId}`);
      const response = await axios.get(`http://localhost:8080/api/customer/wishlist/${userId}`);
      setWishlist(response.data);
      updateWishlistCount(response.data.length);
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  if (!wishlist.length) {
    return <div>{t('en.Loading')}</div>;
  }

  return (
    <Container style={{ direction: direction }}>
      <Row>
        <Col>
          <h2>{t('en.Wishlist')}</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>{t('en.Product Name')}</th>
                <th>{t('en.Price')}</th>
                <th>{t('en.Image')}</th>
                <th>{t('en.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.price}</td>
                  <td>
                    <Image
                      src={`data:image/jpeg;base64,${item.returnedImg}`}
                      thumbnail
                      style={{ width: '100px', height: '100px' }} // Modifier la taille ici
                    />
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> {t('en.Remove')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Wishlist;
