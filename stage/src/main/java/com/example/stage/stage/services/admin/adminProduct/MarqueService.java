package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.MarqueDto;
import com.example.stage.stage.entity.Marque;
import com.example.stage.stage.repostory.MarqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarqueService {

    @Autowired
    private MarqueRepository marqueRepository;

    public MarqueDto getMarqueByNom(String nom) {
        Marque marque = marqueRepository.findByNom(nom);
        if (marque != null) {
            return convertToDto(marque);
        } else {
            return null;
        }
    }

    private MarqueDto convertToDto(Marque marque) {
        MarqueDto marqueDto = new MarqueDto();
        marqueDto.setId(marque.getId());
        marqueDto.setNom(marque.getNom());
        marqueDto.setNom_ar(marque.getNom_ar());
        return marqueDto;
    }

    public List<MarqueDto> getAllMarques() {
        return marqueRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MarqueDto getMarqueById(Long id) {
        Marque marque = marqueRepository.findById(id).orElse(null);
        if (marque != null) {
            return convertToDto(marque);
        } else {
            return null;
        }
    }

    public MarqueDto createMarque(MarqueDto marqueDto) {
        Marque marque = new Marque();
        marque.setNom(marqueDto.getNom());
        marque.setNom_ar(marqueDto.getNom_ar());
        Marque savedMarque = marqueRepository.save(marque);
        return convertToDto(savedMarque);
    }

    public MarqueDto updateMarque(Long id, MarqueDto marqueDto) {
        Marque marque = marqueRepository.findById(id).orElse(null);
        if (marque != null) {
            marque.setNom(marqueDto.getNom());
            marque.setNom_ar(marqueDto.getNom_ar());
            Marque updatedMarque = marqueRepository.save(marque);
            return convertToDto(updatedMarque);
        } else {
            return null;
        }
    }

    public void deleteMarque(Long id) {
        marqueRepository.deleteById(id);
    }
}
