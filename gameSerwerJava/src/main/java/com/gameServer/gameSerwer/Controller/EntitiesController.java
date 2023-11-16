package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.Entities;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.EntityService;
import com.gameServer.gameSerwer.Service.UserService;
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
@RequestMapping("/api/entities")
@CrossOrigin
public class EntitiesController {
    @Autowired
    private EntityService entityService;
    @Autowired
    private UserService userService;
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public EntitiesController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public ResponseEntity<?> getAllEntities() {
        try {
            List<Entities> entities = entityService.getAllEntities();
            return new ResponseEntity<>(Map.of("data", entities), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PutMapping("/{entityId}")
    public ResponseEntity<?> updateEntity(@PathVariable String entityId, @RequestBody Entities entity) {
        try {
            Entities existingEntity = entityService.getAllEntities().stream()
                    .filter(e -> e.getId().equals(entityId))
                    .findFirst()
                    .map(e -> entityService.updateEntity(entityId, entity))
                    .orElseThrow(() -> new Exception("Entity not found"));

            if(existingEntity == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Entity not found");
            } else {
                Entities updatedEntity = entityService.updateEntity(entityId, entity);
                messagingTemplate.convertAndSend("/topic/entities", getAllEntities());
                System.out.println("Entity updated" + updatedEntity);

                return ResponseEntity.status(HttpStatus.OK).body(existingEntity);
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
            UserController userController = new UserController(messagingTemplate);
            messagingTemplate.convertAndSend("/topic/killEntity", userController.getAllUsers());
            //ToDo
            //changing entity status to dead

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
