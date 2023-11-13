package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.User;

import java.util.List;
import java.util.Optional;


public interface UserService {
    List<User> getAllUsers();
    User addUser(User user);
    String hashPassword(String password);
    Boolean loginValidation(String email, String password);
    User updateUserPosition(User user);
    Boolean deleteUser(String id);
}
