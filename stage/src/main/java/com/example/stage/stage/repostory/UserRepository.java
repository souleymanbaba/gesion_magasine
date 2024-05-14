package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.User;
import com.example.stage.stage.enums.UserRole;
import org.aspectj.apache.bcel.util.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@org.springframework.stereotype.Repository

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findFirstByEmail(String email);
    User findByRole(UserRole userRole);
}
