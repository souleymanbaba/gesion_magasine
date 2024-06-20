package com.example.stage.stage.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private Long price;
    private String description;
    private byte[] byteimg;
    private Long categoryId;
    private String categoryName;
    private Long marqueId;
    private String marque;
    private MultipartFile img;
    private Long quantity;
    private String Taille;
    private String name_ar;
    private String description_ar;
    private String taille_ar;
    private String marque_ar;
    private int quantiteStock;
}
