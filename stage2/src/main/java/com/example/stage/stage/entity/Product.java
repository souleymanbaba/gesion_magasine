package com.example.stage.stage.entity;

import com.example.stage.stage.dto.ProductDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Entity
@Data
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long price;
    private String taille;

    private String name_ar;
    private String description_ar;
    private String taille_ar;

    @Lob
    private String description;

    @Lob
    @Column(columnDefinition = "longblob")
    private byte[] img;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "marque_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Marque marque;

    private int quantiteStock;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MouvementStock> mouvementsStock;

    public ProductDto getDto(String lang) {
        ProductDto productDto = new ProductDto();
        productDto.setId(id);

        // Nom du produit
        if ("ar".equals(lang) && name_ar != null) {
            productDto.setName(name_ar);
        } else {
            productDto.setName(name);
        }

        productDto.setPrice(price);

        // Description du produit
        if ("ar".equals(lang) && description_ar != null) {
            productDto.setDescription(description_ar);
        } else {
            productDto.setDescription(description);
        }

        productDto.setByteimg(img);

        // Marque du produit
        if ("ar".equals(lang) && marque.getNom_ar() != null) {
            productDto.setMarque(marque.getNom_ar());
        } else {
            productDto.setMarque(marque.getNom());
        }

        // Taille du produit
        if ("ar".equals(lang) && taille_ar != null) {
            productDto.setTaille(taille_ar);
        } else {
            productDto.setTaille(taille);
        }

        productDto.setCategoryId(category.getId());
        if ("ar".equals(lang) && category.getNom_ar() != null) {
            productDto.setCategoryName(category.getNom_ar());
        } else {
            productDto.setCategoryName(category.getName());
        }

        productDto.setMarqueId(marque.getId());
        productDto.setQuantiteStock(quantiteStock);

        return productDto;
    }

    public void updateStockQuantity(int quantity, MouvementStock.TypeMouvement type) {
        if (type == MouvementStock.TypeMouvement.ENTREE) {
            this.quantiteStock += quantity;
        } else if (type == MouvementStock.TypeMouvement.SORTIE) {
            if (this.quantiteStock >= quantity) {
                this.quantiteStock -= quantity;
            } else {
                throw new IllegalArgumentException("Not enough stock available");
            }
        }
    }
}
