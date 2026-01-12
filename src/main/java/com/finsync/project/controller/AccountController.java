package com.finsync.project.controller;

import com.finsync.project.model.Account;
import com.finsync.project.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> getAccounts(@RequestParam String userId) {
        return ResponseEntity.ok(accountService.getAccountsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        return ResponseEntity.ok(accountService.saveAccount(account));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable String id, @RequestBody Account account) {
        account.setId(id);
        return ResponseEntity.ok(accountService.saveAccount(account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable String id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable String id) {
        Optional<Account> acc = accountService.getAccountById(id);
        return acc.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}