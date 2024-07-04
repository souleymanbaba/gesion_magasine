import { getUserId } from './components/pages/Account/userStorageService';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Image, Button, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './C.css';
import { Link } from 'react-router-dom';

const Wishlist = ({ updateWishlistCount }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [direction, setDirection] = useState('ltr');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const userId = getUserId();

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }, [i18n.language]);

  useEffect(() => {
    const fetchWishlistData = async (lang) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customer/wishlist/${userId}`, { params: { lang } });
        setWishlist(response.data);
        updateWishlistCount(response.data.length);
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData(i18n.language);
  }, [userId, updateWishlistCount, i18n.language]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/customer/wishlist/${itemId}`, { params: { lang: i18n.language } });
      const response = await axios.get(`http://localhost:8080/api/customer/wishlist/${userId}`, { params: { lang: i18n.language } });
      setWishlist(response.data);
      updateWishlistCount(response.data.length);
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (wishlist.some(item => item.productId === productId)) {
      alert(t('en.Product already in wishlist.'));
      return;
    }
    
    try {
      const response = await axios.post(`http://localhost:8080/api/customer/wishlist`, {
        userId,
        productId
      });
      if (response.status === 200) {
        const updatedWishlist = await axios.get(`http://localhost:8080/api/customer/wishlist/${userId}`, { params: { lang: i18n.language } });
        setWishlist(updatedWishlist.data);
        updateWishlistCount(updatedWishlist.data.length);
      }
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  };

  if (!userId) {
    navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        {t('en.Your wishlist is empty.')}
        <br />
        <Button as={Link} to="/products" variant="primary">{t('sho_now')}</Button>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container style={{ direction: direction }}>
      <Row>
        <Col>
          <h2 className="text-center">{t('en.Wishlist')}</h2>
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
                      <strong>{t('en.Price')}:</strong> {item.price}
                    </Card.Text>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-auto"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> {t('en.Remove')}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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
        </Col>
      </Row>
    </Container>
  );
};

export default Wishlist;
