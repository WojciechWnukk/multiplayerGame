package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.Entities;
import com.gameServer.gameSerwer.Service.EntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/entities")
@CrossOrigin
public class EntitiesController {
    @Autowired
    private EntityService entityService;
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

}
