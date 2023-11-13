package com.gameServer.gameSerwer.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Getter
@Setter
@AllArgsConstructor
@ToString
@Document("users")
public class User {
    private String id;
    private String nick;
    private int x;
    private int y;
    private int lvl;
    private boolean online;
    private String email;
    private String password;






}