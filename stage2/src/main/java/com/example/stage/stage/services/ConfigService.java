package com.example.stage.stage.services;

import com.example.stage.stage.entity.config;
import com.example.stage.stage.repostory.ConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {
    @Autowired
    private ConfigRepository configRepository;
    public int getMinOrderValue(){
        return  configRepository.findBykey("minOrderValue").getPrix_minimal();

    }

    public void updateMinOrderValue(int minOrderValue){
        config config =configRepository.findBykey("minOrderValue");
        config.setPrix_minimal(minOrderValue);
        configRepository.save(config);
    }
}
