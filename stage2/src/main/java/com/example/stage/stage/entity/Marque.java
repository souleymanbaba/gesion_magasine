package com.example.stage.stage.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "marque")
public class Marque {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String nom_ar;
}
