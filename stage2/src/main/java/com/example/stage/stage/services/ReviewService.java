package com.example.stage.stage.services;

import com.example.stage.stage.entity.Review;

import com.example.stage.stage.entity.User;
import com.example.stage.stage.repostory.ReviewRepository;
import com.example.stage.stage.repostory.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {


    private final ReviewRepository reviewRepository;


    private final UserRepository userRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public User findUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElseThrow(() -> new RuntimeException("User not found"));
    }
}
