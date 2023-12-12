package com.gameServer.gameSerwer;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Repository.UserRepository;
import com.gameServer.gameSerwer.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest(classes = GameSerwerApplication.class)
@EnableAutoConfiguration(exclude = SecurityAutoConfiguration.class)
public class UserServiceTest {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @BeforeEach
    void setUp(){
        userRepository.deleteAll();
    }



    //unit tests

    @Test
    public void getAllUsers_shouldReturnListOfUsers() {
        System.out.println(userService.getAllUsers());
        // Arrange
        User user = new User("1", "user1", 0, 0, 1, true, "email@w.pl", "passwor@wd");
        User user2 = new User("2", "user2", 0, 0, 1, true, "email2@w.pl", "passsawword2");

        userService.addUser(user);
        userService.addUser(user2);
        User[] usersArray = {user, user2};

        // Act
        List<User> users = userService.getAllUsers();
        // Assert
        assertThat(users, hasSize(usersArray.length));

    }

    @Test
    public void movePlayer_shouldUpdateUserPosition() {
        // Arrange
        User user = new User("1", "user1", 0, 0, 1, true, "email", "password");

        userService.addUser(user);

        User userUpdated = new User("1", "user1", 40, 40, 1, true, "email", "password");


        assertEquals(0, user.getX());
        assertEquals(0, user.getY());
        // Act
        userService.updateUserPosition(userUpdated);

        // Assert
        Optional<User> actualUser = userService.getUserById("1");
        assertTrue(actualUser.isPresent());

        User retrievedUser = actualUser.get();
        assertEquals("1", retrievedUser.getId());
        assertEquals(40, retrievedUser.getX());
        assertEquals(40, retrievedUser.getY());
        assertEquals("user1", retrievedUser.getNick());
    }

    @Test
    public void loginValidation() {

        // Act & Assert
        assertTrue(userService.loginValidation("nonEmptyEmail@wp.pl", "nonEmptyPassword"));

        assertFalse(userService.loginValidation("", "password"));
        assertFalse(userService.loginValidation("email", ""));
        assertFalse(userService.loginValidation("", ""));
    }







}
