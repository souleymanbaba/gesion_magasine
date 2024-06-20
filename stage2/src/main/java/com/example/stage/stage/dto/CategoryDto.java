package com.example.stage.stage.dto;

import lombok.Data;

@Data
public class CategoryDto {
    private Long id;
    private String name;
    private String nom_ar;  // Ajout du champ nom_ar
    private Long parentCategoryId;
}
