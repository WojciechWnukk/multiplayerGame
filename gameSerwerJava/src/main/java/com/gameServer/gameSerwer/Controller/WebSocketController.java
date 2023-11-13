package com.gameServer.gameSerwer.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gameServer.gameSerwer.Model.Message;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;


@Controller
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private UserService userService;


    @MessageMapping("/connection")
    @SendTo("/topic/connection")
    public ResponseEntity<?> connection(@Payload Message payload) {
        Map<String, String> message = new HashMap<>();
        message.put("content", "Połączono z WebSocketem");

        System.out.println(payload.toString());
        //userService.updateUserPosition(payload);
        messagingTemplate.convertAndSend("/topic/connection", message);
        return ResponseEntity.status(200).body("Połączono z WebSocketem - serwer");
    }



}

