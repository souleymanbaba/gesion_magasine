package com.example.stage.stage.services.admin.Category;

import com.example.stage.stage.dto.CategoryDto;
import com.example.stage.stage.entity.Category;

import java.util.List;

public interface CategoryService {
     Category createcategory(CategoryDto categoryDto) ;
    List<CategoryDto> getAllCategories(String lang);
    List<CategoryDto> getCategoryAndSubcategories(Long categoryId, String lang);
    List<CategoryDto> convertToCategoryDtoList(List<Category> categories, String lang);
    Category updateCategoryTranslation(Long categoryId, CategoryDto categoryDto);
    Boolean deleteCategory(Long categoryId);
    Category updateCategory(Long categoryId, CategoryDto categoryDto);
}
