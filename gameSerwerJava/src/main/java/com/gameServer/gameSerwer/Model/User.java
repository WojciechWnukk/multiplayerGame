package com.gameServer.gameSerwer.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public class User {
    @Id
    private String id;

    private String nick;
    private int x;
    private int y;
    private int lvl;
    private boolean online;
    private String email;
    private String password;

    public User(String nick, int x, int y, int lvl, boolean online, String email, String password) {
        this.nick = nick;
        this.x = x;
        this.y = y;
        this.lvl = lvl;
        this.online = online;
        this.email = email;
        this.password = password;
    }


}