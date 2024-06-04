package com.example.stage.stage.services.admin.Category;

import com.example.stage.stage.dto.CategoryDto;
import com.example.stage.stage.entity.Category;
import com.example.stage.stage.repostory.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public Category createcategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setNomAr(categoryDto.getNom_ar()); // Ajouter nom_ar

        if (categoryDto.getParentCategoryId() != null) {
            Category parentCategory = categoryRepository.findById(categoryDto.getParentCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found"));
            category.setParentCategory(parentCategory);
        }
        return categoryRepository.save(category);
    }

    public List<CategoryDto> getAllCategories(String lang) {
        List<Category> categories = categoryRepository.findAll();
        return convertToCategoryDtoList(categories, lang);
    }

    public List<CategoryDto> getCategoryAndSubcategories(Long categoryId, String lang) {
        List<Category> categories = categoryRepository.findCategoryAndSubcategories(categoryId);
        return convertToCategoryDtoList(categories, lang);
    }

    public List<CategoryDto> convertToCategoryDtoList(List<Category> categories, String lang) {
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (Category category : categories) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setId(category.getId());
            if ("fr".equals(lang)) {
                categoryDto.setName(category.getName());
            } else {
                categoryDto.setName(category.getNomAr());
            }
            categoryDto.setParentCategoryId(category.getParentCategory() != null ? category.getParentCategory().getId() : null);
            categoryDtos.add(categoryDto);
        }
        return categoryDtos;
    }

    public Category updateCategoryTranslation(Long categoryId, CategoryDto categoryDto) {
        Optional<Category> optionalCategory = categoryRepository.findById(categoryId);
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            if (categoryDto.getNom_ar() != null) {
                category.setNomAr(categoryDto.getNom_ar());
            }

            return categoryRepository.save(category);
        } else {
            return null;
        }
    }
}
