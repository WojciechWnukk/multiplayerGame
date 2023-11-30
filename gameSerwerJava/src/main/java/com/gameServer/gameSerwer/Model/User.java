package com.gameServer.gameSerwer.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
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

    public Boolean getOnline() {
        return online;
    }


}