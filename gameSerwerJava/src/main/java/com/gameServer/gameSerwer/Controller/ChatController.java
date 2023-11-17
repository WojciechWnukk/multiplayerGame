package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.Message;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.ChatService;
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
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;



    @MessageMapping("chat")
    @SendTo("/topic/chat")
    public void chat(@Payload String payload) {
        chatService.processChatMessage(payload);
    }

}

