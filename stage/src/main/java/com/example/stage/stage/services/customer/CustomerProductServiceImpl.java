package com.example.stage.stage.services.customer;

import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.repostory.ProcuctRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerProductServiceImpl implements CustomerProductService {
    private final ProcuctRepository productRepository;

    public List<ProductDto> getAllProducts(){
        List<Product> products =productRepository.findAll();
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductByName(String name){

        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream().map(Product::getDto).collect(Collectors.toList());

    }

}
