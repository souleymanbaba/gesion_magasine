package com.example.stage.stage.services.admin.Category;


import com.example.stage.stage.dto.CategoryDto;
import com.example.stage.stage.entity.Category;
import com.example.stage.stage.repostory.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final   CategoryRepository categoryRepository;
    public Category createcategory (CategoryDto categoryDto) {
        Category category =new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        if (categoryDto.getParentCategoryId() != null) {
            Category parentCategory = categoryRepository.findById(categoryDto.getParentCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found"));
            category.setParentCategory(parentCategory);
        }
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories(){ return categoryRepository.findAll();
    }



    public List<CategoryDto> getCategoryAndSubcategories(Long categoryId) {
        List<Category> categories = categoryRepository.findCategoryAndSubcategories(categoryId);
        return convertToDtoList(categories);
    }

    public List<CategoryDto> convertToDtoList(List<Category> categories) {
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (Category category : categories) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setId(category.getId());
            categoryDto.setName(category.getName());
            categoryDto.setDescription(category.getDescription());
            categoryDto.setParentCategoryId(category.getParentCategory() != null ? category.getParentCategory().getId() : null);
            categoryDtos.add(categoryDto);
        }
        return categoryDtos;
    }

}