package com.gameServer.gameSerwer.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
//@AllArgsConstructor
@ToString
public class User {
    private String id;
    private String nick;
    private int x;
    private int y;
    private int lvl;
    private boolean online;
    private String email;
    private String password;
    private String roles;

    public Boolean getOnline() {
        return online;
    }


    public User(String id, String nick, int x, int y, int lvl, boolean online, String email, String password) {
        this.id = id;
        this.nick = nick;
        this.x = x;
        this.y = y;
        this.lvl = lvl;
        this.online = online;
        this.email = email;
        this.password = password;
        this.roles = "User";
    }

}