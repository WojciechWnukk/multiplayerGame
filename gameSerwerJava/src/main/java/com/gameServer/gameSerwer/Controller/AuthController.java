package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> auth(@RequestBody User user) {

        Optional<User> existingUser = userService.getAllUsers().stream()
                .filter(u -> u.getEmail().equals(user.getEmail()))
                .findFirst();
        if (userService.loginValidation(user.getEmail(), user.getPassword()) == false) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
        }

        if (!existingUser.isPresent()) {
            System.out.println("User with this nick didn't exists");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
        }

        if (!BCrypt.checkpw(user.getPassword(), existingUser.get().getPassword())) {
            System.out.println("Invalid Password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
        }

        return ResponseEntity.status(HttpStatus.OK).body(existingUser.get().getId());

    }
}

