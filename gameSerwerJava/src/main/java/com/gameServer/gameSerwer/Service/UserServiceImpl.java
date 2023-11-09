package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userrepository;

    @Override
    public List<User> getAllUsers(){
        return userrepository.findAll();
    }

    @Override
    public User addUser(User user){
        System.out.println("Dodaje nowego user" + user);
        return userrepository.save(user);
    }

    @Override
    public String hashPassword(String password){
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    @Override
    public Boolean loginValidation(String email, String password){
        if(email.isEmpty() || password.isEmpty()){
            return false;
        }
        return true;
    }

    @Override
    public User updateUser(String id, User user){
        User userToUpdate = userrepository.findById(id).get();
        userToUpdate.setNick(user.getNick());
        userToUpdate.setPassword(user.getPassword());
        userToUpdate.setX(user.getX());
        userToUpdate.setY(user.getY());
        return userrepository.save(userToUpdate);
    }

}
