package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public UserController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return new ResponseEntity<>(Map.of("data", users), HttpStatus.OK);
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
    public ResponseEntity<?> movePlayer(@PathVariable("playerId") String playerId, @RequestBody User user) {
        try {
            User existingUser = userService.getAllUsers().stream()
                    .filter(u -> u.getId().equals(playerId))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with this id not found"));

                User updatedUser = userService.updateUserPosition(user);
                messagingTemplate.convertAndSend("/topic/playerPosition", getAllUsers());

                System.out.println("Aktualizacja pozycji gracza" + updatedUser.getX() + updatedUser.getY() + updatedUser.getId() + updatedUser.toString());
                return ResponseEntity.status(HttpStatus.OK).body(updatedUser.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<?> deleteUser(@PathVariable("playerId") String playerId) {
        try {
            User existingUser = userService.getAllUsers().stream()
                    .filter(u -> u.getId().equals(playerId))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with this id not found"));

                userService.deleteUser(playerId);
                return ResponseEntity.status(HttpStatus.OK).body("User deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @MessageMapping("connection")
    @SendTo("/topic/connection")
    public void connectPlayer(@Payload String payload) {
        System.out.println("Connected..." + payload.toString());
        try {
            JSONObject jsonObject = new JSONObject(payload);
            String playerId = jsonObject.getString("playerId");
            Boolean online = jsonObject.getBoolean("online");
            System.out.println("Player ID: " + playerId + ", Online: " + online);
            Optional<User> userOptional = userService.getUserById(playerId);
            userOptional.ifPresent(user -> {
                userService.updateUserOnline(user, online);
            });
            messagingTemplate.convertAndSend("/topic/connection", getAllUsers());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @MessageMapping("disconnectPlayer")
    @SendTo("/topic/disconnectPlayer")
    public void disconnectPlayer(@Payload String payload) {
        System.out.println("Disconnecting..." + payload);
        try {
            JSONObject jsonObject = new JSONObject(payload);
            String playerId = jsonObject.getString("playerId");
            Boolean online = jsonObject.getBoolean("online");
            Optional<User> userOptional = userService.getUserById(playerId);
            userOptional.ifPresent(user -> {
                userService.updateUserOnline(user, online);
            });
            messagingTemplate.convertAndSend("/topic/disconnectPlayer", getAllUsers());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
