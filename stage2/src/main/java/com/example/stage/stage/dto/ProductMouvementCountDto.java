package com.example.stage.stage.dto;

import com.example.stage.stage.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductMouvementCountDto {
    private Product product;
    private int mouvementCount;
}
