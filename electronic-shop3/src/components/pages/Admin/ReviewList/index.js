import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Container, Row, Col, Pagination } from 'react-bootstrap';
import './ReviewsList.css';

function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5); // Nombre d'avis par page

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  // Obtenir les avis pour la page actuelle
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Row>
        <Col>
          <br />
          <br />
          <h2 className="my-4">Reviews</h2>
          <ListGroup>
            {currentReviews.map(review => (
              <ListGroup.Item key={review.id}>
                <strong></strong>
                <div><strong>Phone Number:</strong> {review.userName}</div>
                <div><strong>Message:</strong> {review.content}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <br></br>
          <Pagination>
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) => (
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
}

export default ReviewsList;
