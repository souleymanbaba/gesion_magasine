package com.firstapp;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Spécifiez ici les URL pour lesquelles vous souhaitez autoriser CORS
                .allowedOrigins("http://localhost:3000") // Autoriser les requêtes provenant de ce domaine
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Autoriser ces méthodes HTTP
                .allowCredentials(true); // Autoriser les cookies, le cas échéant
    }
}

