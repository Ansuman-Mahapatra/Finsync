package com.finsync.project.service;

import com.finsync.project.model.Account;
import com.finsync.project.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public List<Account> getAccountsByUser(String userId) {
        return accountRepository.findByUserIdOrderByNameAsc(userId);
    }

    public Optional<Account> getAccountById(String id) {
        return accountRepository.findById(id);
    }

    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }

    public void deleteAccount(String id) {
        accountRepository.deleteById(id);
    }
}