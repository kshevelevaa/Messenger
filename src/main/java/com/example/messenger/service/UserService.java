package com.example.messenger.service;

import com.example.messenger.entity.Role;
import com.example.messenger.entity.User;
import com.example.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.Objects;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public User save(User user) {
        return userRepository.saveAndFlush(user);
    }

    @Transactional
    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Transactional
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }


    public void saveUser(User user) {
        User userFromDB = userRepository.findUserByUsername(user.getUsername());
        if (userFromDB != null) {
            return;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton(Role.ROLE_USER));
        save(user);
    }

    public User getUserAuth() {
        User userAuth=(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findUserById(userAuth.getId());
    }

    public String validateRegister(User user, BindingResult bindingResult) {

        if (!Objects.equals(user.getPassword(), user.getPasswordConfirm())) {
            bindingResult.addError(new FieldError("user", "passwordConfirm", "Пароли не совпадают"));
        }
        if (findUserByUsername(user.getUsername()) != null) {
            bindingResult.addError(new FieldError("user", "username", "Пользователь с таким никнеймом уже существует"));
        }
        if (findUserByEmail(user.getEmail()) != null) {
            bindingResult.addError(new FieldError("user", "email", "Пользователь с такой почтой уже существует"));
        }
        if (bindingResult.hasErrors()) {
            return "/pages-register";
        }
        try {

            saveUser(user);
            return "redirect:/login";
        } catch (Exception e) {
            return "/pages-register";
        }
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        } else return user;
    }
}
