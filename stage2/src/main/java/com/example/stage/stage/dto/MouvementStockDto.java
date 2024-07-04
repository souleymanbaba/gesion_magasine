package com.example.stage.stage.dto;

import com.example.stage.stage.entity.MouvementStock;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MouvementStockDto {
    private Long productId;
    private MouvementStock.TypeMouvement type;
    private int quantite;
    private String remarque;
    private LocalDateTime dateMouvement;

}



