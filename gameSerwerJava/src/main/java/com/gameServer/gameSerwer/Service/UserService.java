package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.User;

import java.util.List;


public interface UserService {
    List<User> getAllUsers();
    User addUser(User user);
    String hashPassword(String password);
}
