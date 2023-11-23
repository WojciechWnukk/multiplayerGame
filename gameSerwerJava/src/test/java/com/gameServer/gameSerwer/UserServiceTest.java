package com.gameServer.gameSerwer;

import com.gameServer.gameSerwer.Controller.UserController;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Repository.UserRepository;
import com.gameServer.gameSerwer.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import static org.hamcrest.MatcherAssert.assertThat;


import java.lang.reflect.Array;
import java.util.*;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class UserServiceTest {

    @Autowired
    private UserService userService;
    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

    }

    @Test
    public void getAllUsers_shouldReturnListOfUsers() {
        // Arrange
        User user = new User("1", "user1", 0, 0, 1, true, "email", "password");
        User user2 = new User("2", "user2", 0, 0, 1, true, "email2", "password2");

        userService.addUser(user);
        userService.addUser(user2);
        User[] usersArray = {user, user2};

        when(userService.getAllUsers()).thenReturn(Arrays.asList(usersArray));

        // Act
        List<User> users = userService.getAllUsers();
        // Assert
        assertThat(users, hasSize(usersArray.length));

    }

    @Test
    public void movePlayer_shouldUpdateUserPosition() {
        // Arrange
        User user = new User("1", "user1", 0, 0, 1, true, "email", "password");
        when(userService.updateUserPosition(any(User.class))).thenReturn(user);

        User userUpdated = new User("1", "user1", 40, 40, 1, true, "email", "password");
        when(userService.updateUserPosition(any(User.class))).thenReturn(userUpdated);
        when(userService.getUserById("1")).thenReturn(Optional.of(userUpdated));

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
        assertEquals(true, userService.loginValidation("nonEmptyEmail", "nonEmptyPassword"));

        assertFalse(userService.loginValidation("", "password"));
        assertFalse(userService.loginValidation("email", ""));
        assertFalse(userService.loginValidation("", ""));
    }





}
