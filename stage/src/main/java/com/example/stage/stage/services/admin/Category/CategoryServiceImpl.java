package com.example.stage.stage.services.admin.Category;


import com.example.stage.stage.dto.CategoryDto;
import com.example.stage.stage.entity.Category;
import com.example.stage.stage.repostory.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final   CategoryRepository categoryRepository;
    public Category createcategory (CategoryDto categoryDto) {
        Category category =new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories(){ return categoryRepository.findAll();
    }

}