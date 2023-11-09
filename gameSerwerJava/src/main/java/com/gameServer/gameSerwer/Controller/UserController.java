package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public ResponseEntity<?> addUser(@RequestBody User user) {
        try {
            Optional<User> existingUser = userService.getAllUsers().stream()
                    .filter(u -> u.getNick().equals(user.getNick()))
                    .findFirst();

            if (existingUser.isPresent()) {
                System.out.println("User with this nick already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this nick already exists");
            }

            System.out.println(user);
            String password = user.getPassword();
            String hashedPassword = userService.hashPassword(password);
            user.setPassword(hashedPassword);

            User newUser = userService.addUser(user);
            System.out.println(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }




}
