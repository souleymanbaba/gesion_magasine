package com.example.stage.stage.controller.admin;

import com.example.stage.stage.dto.MarqueDto;
import com.example.stage.stage.services.admin.adminProduct.MarqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marques")
public class MarqueController {

    @Autowired
    private MarqueService marqueService;

    @GetMapping("/nom/{nom}")
    public ResponseEntity<MarqueDto> getMarqueByNom(@PathVariable String nom) {
        MarqueDto marqueDto = marqueService.getMarqueByNom(nom);
        if (marqueDto != null) {
            return ResponseEntity.ok(marqueDto);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<MarqueDto> getAllMarques() {
        return marqueService.getAllMarques();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarqueDto> getMarqueById(@PathVariable Long id) {
        MarqueDto marqueDto = marqueService.getMarqueById(id);
        if (marqueDto != null) {
            return ResponseEntity.ok(marqueDto);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<MarqueDto> createMarque(@RequestBody MarqueDto marqueDto) {
        MarqueDto createdMarque = marqueService.createMarque(marqueDto);
        return ResponseEntity.ok(createdMarque);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarqueDto> updateMarque(@PathVariable Long id, @RequestBody MarqueDto marqueDto) {
        MarqueDto updatedMarque = marqueService.updateMarque(id, marqueDto);
        if (updatedMarque != null) {
            return ResponseEntity.ok(updatedMarque);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarque(@PathVariable Long id) {
        marqueService.deleteMarque(id);
        return ResponseEntity.noContent().build();
    }
}

