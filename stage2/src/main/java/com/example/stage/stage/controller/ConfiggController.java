package com.example.stage.stage.controller;

import com.example.stage.stage.services.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/minOrderValue")
public class ConfiggController {
    @Autowired
    private ConfigService  configService;
    @GetMapping("")
    public ResponseEntity<Integer> minOrderValue() {
        return ResponseEntity.ok(configService.getMinOrderValue());

    }

    @PostMapping("")
    public ResponseEntity<Void> updateMinOrderValue(@RequestBody int minOrderValue) {
        configService.updateMinOrderValue(minOrderValue);
        return ResponseEntity.ok().build();
    }

    }



