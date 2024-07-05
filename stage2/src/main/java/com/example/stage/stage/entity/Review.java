package com.example.stage.stage.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String content;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
