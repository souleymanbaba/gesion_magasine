package com.example.stage.stage.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mouvement_stock")
public class MouvementStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private TypeMouvement type;

    private int quantite;

    private LocalDateTime dateMouvement;

    @Lob
    private String remarque;

    public enum TypeMouvement {
        ENTREE,
        SORTIE
    }
}
