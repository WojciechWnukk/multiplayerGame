package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return new ResponseEntity<>(Map.of("data", users, "message", "Lista użytkowników"), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
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
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/{playerId}")
    public ResponseEntity<?> movePlayer (@PathVariable("playerId") String playerId, @RequestBody User user) {
        try {
            Optional<User> existingUser = userService.getAllUsers().stream()
                    .filter(u -> u.getId().equals(playerId))
                    .findFirst();

            if (!existingUser.isPresent()) {
                System.out.println("User with this id doesn't exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with this id doesn't exists");
            }
            //Update user
            User updatedUser = userService.updateUser(playerId, user);
            System.out.println("Aktualizacja pozycji gracza" + updatedUser.getX() + updatedUser.getY() + updatedUser.getId());
            return ResponseEntity.status(HttpStatus.OK).body(updatedUser.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }





}
