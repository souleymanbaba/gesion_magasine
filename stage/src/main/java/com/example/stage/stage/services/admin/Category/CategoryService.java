package com.example.stage.stage.services.admin.Category;

import com.example.stage.stage.dto.CategoryDto;
import com.example.stage.stage.entity.Category;

import java.util.List;

public interface CategoryService {
     Category createcategory(CategoryDto categoryDto) ;
    List<Category> getAllCategories();
    List<CategoryDto> getCategoryAndSubcategories(Long categoryId);
    List<CategoryDto> convertToDtoList(List<Category> categories);
}
