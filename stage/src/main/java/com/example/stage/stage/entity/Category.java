package com.example.stage.stage.entity;

import com.example.stage.stage.dto.CategoryDto;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "category")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String nom_ar;  // Ajout du champ nom_ar

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "parent_category_id")
    private Category parentCategory;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNomAr() {
        return nom_ar;
    }

    public void setNomAr(String nom_ar) {
        this.nom_ar = nom_ar;
    }
    public CategoryDto getCategoryDto() {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(id);
        categoryDto.setNom_ar(nom_ar);
        return categoryDto;
    }
}
