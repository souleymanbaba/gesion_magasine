package com.example.stage.stage.dto;

import com.example.stage.stage.entity.Product;
import com.example.stage.stage.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ReviewDto {
    private Long id;
    private Long rating;
    private String description;
 private MultipartFile img;
    private byte[] returnedImg;

    private Long userId;

    private Long productId;

    private  String username;
}
