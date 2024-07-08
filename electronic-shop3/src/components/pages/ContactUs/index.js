import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserId, isLoggedIn } from '../Account/userStorageService'; // Assurez-vous que ce chemin est correct

function CreateReview() {
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (isLoggedIn()) {
      const fetchedUserId = getUserId();
      if (fetchedUserId) {
        setUserId(fetchedUserId);
      } else {
        alert('User ID is not available. Please log in.');
      }
    } else {
      alert('You must be logged in to submit a review.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userId) {
      try {
        const reviewDTO = {
          content,
          userId
        };
        const response = await axios.post('http://localhost:8080/api/reviews', reviewDTO);
        console.log('Review created:', response.data);
        setContent('');
        alert('Review submitted successfully!');
      } catch (error) {
        console.error('Error creating review:', error);
        alert('Failed to submit the review. Please try again.');
      }
    } else {
      alert('Invalid user data. Please log in again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit a Review</h2>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default CreateReview;
