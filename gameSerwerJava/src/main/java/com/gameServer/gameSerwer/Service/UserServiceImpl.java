package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Controller.EntitiesController;
import com.gameServer.gameSerwer.Model.Entities;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Repository.EntityRepository;
import com.gameServer.gameSerwer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userrepository;

    @Autowired
    private EntityRepository entityrepository;


    @Override
    public List<User> getAllUsers() {
        return (List<User>) userrepository.findAll();
    }

    @Override
    public User addUser(User user) {
        System.out.println("Dodaje nowego user" + user);
        registerValidation(user.getEmail(), user.getPassword(), user.getNick());
        return userrepository.save(user);
    }

    @Override
    public String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    @Override
    public Boolean loginValidation(String email, String password) {
        if (email.isEmpty() || password.isEmpty() || !isValidEmail(email) || password.length() < 8) {
            System.out.println("Email or password is not valid");
            return false;
        }
        return true;
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }

    @Override
    public Boolean registerValidation(String email, String password, String nick) {
        if (email.isEmpty() || password.isEmpty() || nick.isEmpty() || !isValidEmail(email) || password.length() < 8 || nick.length() < 3 || nick.length() > 20) {
            System.out.println("Email or password or nick is not valid");
            return false;
        }
        return true;
    }

    @Override
    public User updateUserPosition(User user) {
        try {
            User userToUpdate = userrepository.findById(user.getId()).get();
            userToUpdate.setX(user.getX());
            userToUpdate.setY(user.getY());
            return userrepository.save(userToUpdate);
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("User with this id does not exist");
        }
    }

    @Override
    public Boolean deleteUser(String id) {
        Optional<User> userToDelete = userrepository.findById(id);
        if (userToDelete.isPresent()) {
            userrepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Optional<User> getUserById(String id) {
        try {
            return userrepository.findById(id);
        } catch (Exception e) {
            System.out.println("Error while fetching user by ID");
            return Optional.empty();
        }
    }


    @Override
    public ResponseEntity<?> updateUserHealth(User user, String entityId) {
        try {
            Optional<User> optionalUser = userrepository.findById(user.getId());
            Optional<Entities> optionalEntity = entityrepository.findById(entityId);

            if (optionalUser.isPresent() && optionalEntity.isPresent()) {
                User userToUpdate = optionalUser.get();
                int points = optionalEntity.get().getType().equals("monster") ? 10*optionalEntity.get().getLvl() : -10;
                if (user.getHealth() - points < 0) {
                    respawnUser(userToUpdate);
                    userToUpdate.setAlive(true);
                    return ResponseEntity.ok().body(userToUpdate);
                } else if(user.getHealth() - points > 100) {
                    userToUpdate.setHealth(100);
                    userrepository.save(userToUpdate);
                    updateUserExp(user, entityId);
                    return ResponseEntity.ok().body(userToUpdate);
                }
                userToUpdate.setHealth(user.getHealth() - points);
                userrepository.save(userToUpdate);
                updateUserExp(user, entityId);

                return ResponseEntity.ok().body(userToUpdate);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<?> updateUserExp(User user, String entityId) {
        try {
            Optional<User> optionalUser = userrepository.findById(user.getId());
            Optional<Entities> optionalEntities = entityrepository.findById(entityId);

            if (optionalUser.isPresent() && optionalEntities.isPresent()) {
                User userToUpdate = optionalUser.get();
                int exp = optionalEntities.get().getType().equals("monster") ? optionalEntities.get().getLvl() * 5 : 0;
                if (user.getExp() + exp >= 100) {
                    userToUpdate.setLvl(user.getLvl() + 1);
                    userToUpdate.setExp(0);
                    userToUpdate.setHealth(100);
                } else {
                    userToUpdate.setExp(user.getExp() + exp);
                }
                userrepository.save(userToUpdate);
                return ResponseEntity.ok().body(userToUpdate);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<?> updateUserOnline(User user, Boolean online) {
        try {
            user.setOnline(online);
            userrepository.save(user);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public void respawnUser(User user) {
        user.setHealth(0);
        user.setAlive(false);
        userrepository.save(user);
        new Thread(() -> {
            try {
                Thread.sleep(15000);
                user.setAlive(true);
                user.setHealth(1);
                userrepository.save(user);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }

    private boolean isXYValid(int x, int y) {
        if (x < 0 || x > 1160 || y < 0 || y > 760) {
            System.out.println("X or Y is not valid");
            return false;
        }
        return true;
    }

}