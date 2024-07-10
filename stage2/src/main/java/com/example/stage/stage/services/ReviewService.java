package com.example.stage.stage.services;

import com.example.stage.stage.entity.Review;
import com.example.stage.stage.entity.User;
import com.example.stage.stage.repostory.ReviewRepository;
import com.example.stage.stage.repostory.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public List<Review> getAllReviews() {
        logger.info("Fetching all reviews from the repository");
        return reviewRepository.findAll();
    }

    public Review saveReview(Review review) {
        logger.info("Saving review with content: {}", review.getContent());
        return reviewRepository.save(review);
    }

    public User findUserById(Long id) {
        logger.info("Fetching user with ID: {}", id);
        Optional<User> user = userRepository.findById(id);
        return user.orElseThrow(() -> {
            logger.error("User with ID {} not found", id);
            return new RuntimeException("User not found");
        });
    }
}
