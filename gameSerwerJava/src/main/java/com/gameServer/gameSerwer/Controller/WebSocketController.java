package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.Message;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Controller
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserService userService;


//czy to jest potrzebne??
    /*
    @MessageMapping("/connection")
    @SendTo("/topic/connection")
    public ResponseEntity<?> connection(@Payload Message payload) {
        Map<String, String> message = new HashMap<>();
        message.put("content", "Połączono z WebSocketem");

        System.out.println(payload.toString());
        //userService.updateUserPosition(payload);
        messagingTemplate.convertAndSend("/topic/connection", message);
        return ResponseEntity.status(200).body("Połączono z WebSocketem - serwer");
    }*/

    @MessageMapping("chat")
    @SendTo("/topic/chat")
    public void chat(@Payload String payload) {
        System.out.println("chatting");

        try {
            JSONObject json = new JSONObject(payload);
            String nick = json.getString("text");
            String message = json.getString("author");
            System.out.println("nick: " + nick);
            System.out.println("message: " + message);

            messagingTemplate.convertAndSend("/topic/chat", payload);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }



}

