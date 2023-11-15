package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import org.bson.json.JsonObject;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
                    .orElse(null);

            if (existingUser == null) {
                System.out.println("User with this id doesn't exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with this id doesn't exists");
            } else {
                //Update user
                User updatedUser = userService.updateUserPosition(user);
                messagingTemplate.convertAndSend("/topic/playerPosition", getAllUsers());

                System.out.println("Aktualizacja pozycji gracza" + updatedUser.getX() + updatedUser.getY() + updatedUser.getId() + updatedUser.toString());
                return ResponseEntity.status(HttpStatus.OK).body(updatedUser.getId());
            }
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
                    .orElse(null);

            if (existingUser == null) {
                System.out.println("User with this id doesn't exists");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with this id doesn't exists");
            } else {
                userService.deleteUser(playerId);
                return ResponseEntity.status(HttpStatus.OK).body("User deleted");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @MessageMapping("killEntity")
    @SendTo("/topic/killEntity")
    public void killEntity(@Payload String payload) {
        System.out.println("Killing...");

        try {
            // Ręczne parsowanie JSON do obiektu
            JSONObject jsonObject = new JSONObject(payload);
            String entityId = jsonObject.getString("entityId");
            String playerId = jsonObject.getString("playerId");

            System.out.println("Received killEntity message. Entity ID: " + entityId + ", Player ID: " + playerId);

            Optional<User> userOptional = userService.getUserById(playerId);
            userOptional.ifPresent(user -> {
                userService.updateUserLvl(user);
            });
            //lvl increase
            messagingTemplate.convertAndSend("/topic/killEntity", getAllUsers());
            //ToDo
            //changing entity status to dead

        } catch ( JSONException e) {
            e.printStackTrace();
        }
    }


}
