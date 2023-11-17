package com.gameServer.gameSerwer.Service;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService{
    @Autowired
    private UserService userService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void processChatMessage(String payload) {
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
