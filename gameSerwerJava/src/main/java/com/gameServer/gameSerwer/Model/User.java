package com.gameServer.gameSerwer.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class User {
    private String id;
    private String nick;
    private int x;
    private int y;
    private int lvl;
    private int exp;
    private boolean online;
    private boolean alive;
    private String email;
    private String password;
    private String roles;
    private int health;

    public Boolean getOnline() {
        return online;
    }


    public User(String id, String nick, int x, int y, int lvl, int exp, boolean online, boolean alive, String email, String password) {
        this.id = id;
        this.nick = nick;
        this.x = x;
        this.y = y;
        this.lvl = lvl;
        this.exp = exp;
        this.online = online;
        this.alive = alive;
        this.email = email;
        this.password = password;
        this.roles = "User";
        this.health = 100;
    }

}