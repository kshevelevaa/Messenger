package com.example.messenger.controller;

import com.example.messenger.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String showIndex(Model model)
    {
        model.addAttribute("user",userService.getUserAuth());
        return "index";
    }

}
