package com.example.stage.stage.entity;

import com.example.stage.stage.dto.ProductDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long price;
    private String marque;
    private Long Taille;

    private String name_ar;
    private String marque_ar;
    private String description_ar;
    private Long taille_ar;

    @Lob
    private String description;

    @Lob
    @Column(columnDefinition = "longblob")
    private byte[] img;

    @ManyToOne(fetch= FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JsonIgnore
    private Category category;

    public ProductDto getDto(String lang) {
        ProductDto productDto = new ProductDto();
        productDto.setId(id);
        productDto.setName("ar".equals(lang) ? name_ar : name);
        productDto.setPrice(price);
        productDto.setDescription("ar".equals(lang) ? description_ar : description);
        productDto.setByteimg(img);
        productDto.setMarque("ar".equals(lang) ? marque_ar : marque);
        productDto.setTaille("ar".equals(lang) ? taille_ar : Taille);
        productDto.setCategoryId(category.getId());
        productDto.setCategoryName(category.getName());
        return productDto;
    }
}
