package com.example.stage.stage.controller;


import com.example.stage.stage.dto.ReviewDTO;
import com.example.stage.stage.entity.Review;
import com.example.stage.stage.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {


    private final ReviewService reviewService;


    @GetMapping
    public List<ReviewDTO> getAllReviews() {
        return reviewService.getAllReviews().stream()
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setId(review.getId());
                    dto.setContent(review.getContent());
                    dto.setUserName(review.getUser().getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ReviewDTO createReview(@RequestBody ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setContent(reviewDTO.getContent());
        review.setUser(reviewService.findUserById(reviewDTO.getUserId()));
        Review savedReview = reviewService.saveReview(review);

        ReviewDTO savedReviewDTO = new ReviewDTO();
        savedReviewDTO.setId(savedReview.getId());
        savedReviewDTO.setContent(savedReview.getContent());
        savedReviewDTO.setUserId(savedReview.getUser().getId());

        return savedReviewDTO;
    }
}
