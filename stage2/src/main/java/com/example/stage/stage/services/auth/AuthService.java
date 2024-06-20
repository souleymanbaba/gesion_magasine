package com.example.stage.stage.services.auth;

import com.example.stage.stage.dto.SignupRequest;
import com.example.stage.stage.dto.UserDto;

public interface AuthService {
    public UserDto createUser(SignupRequest signupRequest);
    public Boolean hasUserWithEmail(String email);
}
