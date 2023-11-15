package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public User updateUserPosition(User user){
        User userToUpdate = userrepository.findById(user.getId()).get();
        userToUpdate.setX(user.getX());
        userToUpdate.setY(user.getY());
        return userrepository.save(userToUpdate);
    }

    @Override
    public Boolean deleteUser(String id){
        Optional<User> userToDelete = userrepository.findById(id);
        if(userToDelete.isPresent()){
            userrepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Optional<User> getUserById(String id){
        try {
            return userrepository.findById(id);
        } catch (Exception e) {
            System.out.println("Error while fetching user by ID");
            return Optional.empty();
        }
    }

    @Override
    public ResponseEntity<?> updateUserLvl(User user){
        try {
            Optional<User> optionalUser = userrepository.findById(user.getId());

            if (optionalUser.isPresent()) {
                User userToUpdate = optionalUser.get();
                userToUpdate.setLvl(user.getLvl() + 1);
                System.out.println("User level updated" + userToUpdate);
                userrepository.save(userToUpdate);
                return ResponseEntity.ok().body(userToUpdate);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("Error while updating user level");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
